const notificationService = require('../services/notificationService');
const ApiResponse = require('../utils/apiResponse');

const getNotifications = async (req, res, next) => {
    try {
        const { page, limit, isRead, type } = req.query;
        const result = await notificationService.getNotifications(req.user.id, {
            page, limit,
            isRead: isRead !== undefined ? isRead === 'true' : undefined,
            type,
        });
        return ApiResponse.paginated(res, result.notifications, result.pagination.page, result.pagination.limit, result.pagination.total, 'Lấy thông báo thành công');
    } catch (error) {
        next(error);
    }
};

const markAsRead = async (req, res, next) => {
    try {
        const notification = await notificationService.markAsRead(req.params.id, req.user.id);
        return ApiResponse.success(res, { notification }, 'Đã đánh dấu đã đọc');
    } catch (error) {
        next(error);
    }
};

const markAllAsRead = async (req, res, next) => {
    try {
        const result = await notificationService.markAllAsRead(req.user.id);
        return ApiResponse.success(res, result, `Đã đánh dấu ${result.modifiedCount} thông báo đã đọc`);
    } catch (error) {
        next(error);
    }
};

const deleteNotification = async (req, res, next) => {
    try {
        await notificationService.deleteNotification(req.params.id, req.user.id);
        return ApiResponse.success(res, null, 'Đã xóa thông báo');
    } catch (error) {
        next(error);
    }
};

const deleteAllRead = async (req, res, next) => {
    try {
        const result = await notificationService.deleteAllRead(req.user.id);
        return ApiResponse.success(res, result, `Đã xóa ${result.deletedCount} thông báo đã đọc`);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
};
