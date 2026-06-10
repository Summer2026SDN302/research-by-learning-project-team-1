const Notification = require('../models/Notification');
const ApiError = require('../utils/apiError');
const { PAGINATION } = require('../config/constants');

const createNotification = async ({ recipient, sender, title, message, type, resourceType, resourceId }) => {
    return Notification.create({
        recipient,
        sender: sender || null,
        title,
        message,
        type: type || 'system',
        resourceType: resourceType || '',
        resourceId: resourceId || null,
    });
};

const getNotifications = async (userId, {
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    isRead,
    type,
}) => {
    const query = { recipient: userId };

    if (isRead !== undefined) query.isRead = isRead;
    if (type) query.type = type;

    const safePage = Math.max(1, parseInt(page, 10));
    const safeLimit = Math.min(Math.max(1, parseInt(limit, 10)), PAGINATION.MAX_LIMIT);
    const skip = (safePage - 1) * safeLimit;

    const [notifications, total, unreadCount] = await Promise.all([
        Notification.find(query)
            .populate('sender', 'name avatar')
            .skip(skip)
            .limit(safeLimit)
            .sort({ createdAt: -1 })
            .lean(),
        Notification.countDocuments(query),
        Notification.countDocuments({ recipient: userId, isRead: false }),
    ]);

    return {
        notifications,
        unreadCount,
        pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) },
    };
};

const markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
        throw ApiError.notFound('Không tìm thấy thông báo');
    }

    if (notification.recipient.toString() !== userId) {
        throw ApiError.forbidden('Không có quyền truy cập thông báo này');
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    return notification;
};

const markAllAsRead = async (userId) => {
    const result = await Notification.updateMany(
        { recipient: userId, isRead: false },
        { $set: { isRead: true, readAt: new Date() } }
    );

    return { modifiedCount: result.modifiedCount };
};

const deleteNotification = async (notificationId, userId) => {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
        throw ApiError.notFound('Không tìm thấy thông báo');
    }

    if (notification.recipient.toString() !== userId) {
        throw ApiError.forbidden('Không có quyền truy cập thông báo này');
    }

    await Notification.findByIdAndDelete(notificationId);
};

const deleteAllRead = async (userId) => {
    const result = await Notification.deleteMany({
        recipient: userId,
        isRead: true,
    });

    return { deletedCount: result.deletedCount };
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
};
