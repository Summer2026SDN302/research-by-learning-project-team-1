const eventService = require('../services/eventService');
const ApiResponse = require('../utils/apiResponse');

const createEvent = async (req, res, next) => {
    try {
        const event = await eventService.createEvent(req.user.id, req.body);
        return ApiResponse.success(res, { event }, 'Tạo sự kiện thành công', 201);
    } catch (error) {
        next(error);
    }
};

const getEvents = async (req, res, next) => {
    try {
        const { page, limit, search, status, upcoming } = req.query;
        const result = await eventService.getEvents({
            page, limit, search, status, upcoming: upcoming === 'true',
        });
        return ApiResponse.paginated(res, result.events, result.pagination.page, result.pagination.limit, result.pagination.total, 'Lấy danh sách sự kiện thành công');
    } catch (error) {
        next(error);
    }
};

const getEventById = async (req, res, next) => {
    try {
        const event = await eventService.getEventById(req.params.id);
        return ApiResponse.success(res, { event }, 'Lấy thông tin sự kiện thành công');
    } catch (error) {
        next(error);
    }
};

const updateEvent = async (req, res, next) => {
    try {
        const event = await eventService.updateEvent(req.params.id, req.user.id, req.user.role, req.body);
        return ApiResponse.success(res, { event }, 'Cập nhật sự kiện thành công');
    } catch (error) {
        next(error);
    }
};

const deleteEvent = async (req, res, next) => {
    try {
        await eventService.deleteEvent(req.params.id, req.user.id, req.user.role);
        return ApiResponse.success(res, null, 'Xóa sự kiện thành công');
    } catch (error) {
        next(error);
    }
};

const registerForEvent = async (req, res, next) => {
    try {
        const participant = await eventService.registerForEvent(req.params.id, req.user.id);
        return ApiResponse.success(res, { participant }, 'Đăng ký sự kiện thành công');
    } catch (error) {
        next(error);
    }
};

const cancelRegistration = async (req, res, next) => {
    try {
        const participant = await eventService.cancelRegistration(req.params.id, req.user.id);
        return ApiResponse.success(res, { participant }, 'Đã hủy đăng ký sự kiện');
    } catch (error) {
        next(error);
    }
};

const checkInParticipant = async (req, res, next) => {
    try {
        const participant = await eventService.checkInParticipant(req.params.id, req.user.id);
        return ApiResponse.success(res, { participant }, 'Check-in thành công');
    } catch (error) {
        next(error);
    }
};

const getMyEvents = async (req, res, next) => {
    try {
        const events = await eventService.getMyEvents(req.user.id);
        return ApiResponse.success(res, { events }, 'Lấy sự kiện của bạn thành công');
    } catch (error) {
        next(error);
    }
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
