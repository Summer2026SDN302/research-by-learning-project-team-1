const Event = require('../models/Event');
const EventParticipant = require('../models/EventParticipant');
const ApiError = require('../utils/apiError');
const { PAGINATION } = require('../config/constants');

const createEvent = async (userId, eventData) => {
    if (new Date(eventData.startAt) >= new Date(eventData.endAt)) {
        throw ApiError.badRequest('Thời gian bắt đầu phải trước thời gian kết thúc');
    }

    const event = await Event.create({
        ...eventData,
        organizer: userId,
    });

    return Event.findById(event._id).populate('organizer', 'name email avatar');
};

const getEvents = async ({
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    search,
    status,
    upcoming,
}) => {
    const query = {};

    if (status) query.status = status;
    if (upcoming) query.startAt = { $gte: new Date() };

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    const safePage = Math.max(1, parseInt(page, 10));
    const safeLimit = Math.min(Math.max(1, parseInt(limit, 10)), PAGINATION.MAX_LIMIT);
    const skip = (safePage - 1) * safeLimit;

    const [events, total] = await Promise.all([
        Event.find(query)
            .populate('organizer', 'name email avatar')
            .skip(skip)
            .limit(safeLimit)
            .sort({ startAt: 1 })
            .lean(),
        Event.countDocuments(query),
    ]);

    const participantCounts = await EventParticipant.aggregate([
        { $match: { event: { $in: events.map((e) => e._id) }, status: 'registered' } },
        { $group: { _id: '$event', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    for (const pc of participantCounts) {
        countMap[pc._id.toString()] = pc.count;
    }

    const enriched = events.map((e) => ({
        ...e,
        participantCount: countMap[e._id.toString()] || 0,
    }));

    return {
        events: enriched,
        pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) },
    };
};

const getEventById = async (eventId) => {
    const event = await Event.findById(eventId)
        .populate('organizer', 'name email avatar');

    if (!event) {
        throw ApiError.notFound('Không tìm thấy sự kiện');
    }

    const participants = await EventParticipant.find({ event: eventId })
        .populate('user', 'name email avatar')
        .sort({ registeredAt: -1 })
        .lean();

    return { ...event.toObject(), participants };
};

const updateEvent = async (eventId, userId, userRole, updateData) => {
    const event = await Event.findById(eventId);

    if (!event) {
        throw ApiError.notFound('Không tìm thấy sự kiện');
    }

    if (userRole !== 'admin' && event.organizer.toString() !== userId) {
        throw ApiError.forbidden('Chỉ người tạo hoặc quản trị viên mới có thể sửa');
    }

    const { title, description, location, onlineLink, startAt, endAt, capacity, tags, status } = updateData;
    const allowedUpdates = {};

    if (title !== undefined) allowedUpdates.title = title;
    if (description !== undefined) allowedUpdates.description = description;
    if (location !== undefined) allowedUpdates.location = location;
    if (onlineLink !== undefined) allowedUpdates.onlineLink = onlineLink;
    if (startAt !== undefined) allowedUpdates.startAt = startAt;
    if (endAt !== undefined) allowedUpdates.endAt = endAt;
    if (capacity !== undefined) allowedUpdates.capacity = capacity;
    if (tags !== undefined) allowedUpdates.tags = tags;
    if (status !== undefined) allowedUpdates.status = status;

    return Event.findByIdAndUpdate(eventId, allowedUpdates, { new: true, runValidators: true })
        .populate('organizer', 'name email avatar');
};

const deleteEvent = async (eventId, userId, userRole) => {
    const event = await Event.findById(eventId);

    if (!event) {
        throw ApiError.notFound('Không tìm thấy sự kiện');
    }

    if (userRole !== 'admin' && event.organizer.toString() !== userId) {
        throw ApiError.forbidden('Chỉ người tạo hoặc quản trị viên mới có thể xóa');
    }

    await Promise.all([
        Event.findByIdAndDelete(eventId),
        EventParticipant.deleteMany({ event: eventId }),
    ]);
};

const registerForEvent = async (eventId, userId) => {
    const event = await Event.findById(eventId);

    if (!event) {
        throw ApiError.notFound('Không tìm thấy sự kiện');
    }

    if (event.status !== 'published') {
        throw ApiError.badRequest('Sự kiện chưa mở đăng ký');
    }

    const existing = await EventParticipant.findOne({ event: eventId, user: userId });

    if (existing) {
        if (existing.status === 'cancelled') {
            existing.status = 'registered';
            existing.registeredAt = new Date();
            await existing.save();
            return existing;
        }
        throw ApiError.badRequest('Bạn đã đăng ký sự kiện này');
    }

    const registeredCount = await EventParticipant.countDocuments({
        event: eventId,
        status: { $in: ['registered', 'checked_in'] },
    });

    if (registeredCount >= event.capacity) {
        const participant = await EventParticipant.create({
            event: eventId,
            user: userId,
            status: 'waitlisted',
        });
        return participant;
    }

    return EventParticipant.create({
        event: eventId,
        user: userId,
        status: 'registered',
    });
};

const cancelRegistration = async (eventId, userId) => {
    const participant = await EventParticipant.findOne({ event: eventId, user: userId });

    if (!participant) {
        throw ApiError.notFound('Bạn chưa đăng ký sự kiện này');
    }

    if (participant.status === 'cancelled') {
        throw ApiError.badRequest('Bạn đã hủy đăng ký rồi');
    }

    const wasRegistered = participant.status === 'registered' || participant.status === 'checked_in';
    participant.status = 'cancelled';
    await participant.save();

    if (wasRegistered) {
        const waitlisted = await EventParticipant.findOne({
            event: eventId,
            status: 'waitlisted',
        }).sort({ registeredAt: 1 });

        if (waitlisted) {
            waitlisted.status = 'registered';
            await waitlisted.save();
        }
    }

    return participant;
};

const checkInParticipant = async (eventId, userId) => {
    const participant = await EventParticipant.findOne({ event: eventId, user: userId });

    if (!participant) {
        throw ApiError.notFound('Bạn chưa đăng ký sự kiện này');
    }

    if (participant.status !== 'registered') {
        throw ApiError.badRequest('Chỉ có thể check-in khi đã đăng ký');
    }

    participant.status = 'checked_in';
    participant.checkedInAt = new Date();
    await participant.save();

    return participant;
};

const getMyEvents = async (userId) => {
    const participations = await EventParticipant.find({
        user: userId,
        status: { $in: ['registered', 'checked_in'] },
    })
        .populate({
            path: 'event',
            populate: { path: 'organizer', select: 'name email avatar' },
        })
        .sort({ registeredAt: -1 })
        .lean();

    return participations
        .filter((p) => p.event)
        .map((p) => ({ ...p.event, registrationStatus: p.status, registeredAt: p.registeredAt }));
};

module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    registerForEvent,
    cancelRegistration,
    checkInParticipant,
    getMyEvents,
};
