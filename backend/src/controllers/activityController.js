const activityService = require('../services/activityService');
const ApiResponse = require('../utils/apiResponse');

const getActivities = async (req, res, next) => {
    try {
        const { page, limit, action, resourceType, severity, actor, from, to } = req.query;
        const result = await activityService.getActivities({
            page, limit, action, resourceType, severity, actor, from, to,
        });
        return ApiResponse.paginated(res, result.activities, result.pagination.page, result.pagination.limit, result.pagination.total, 'Lấy nhật ký hệ thống thành công');
    } catch (error) {
        next(error);
    }
};

const getStats = async (req, res, next) => {
    try {
        const stats = await activityService.getStats();
        return ApiResponse.success(res, { stats }, 'Lấy thống kê hệ thống thành công');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getActivities,
    getStats,
};
