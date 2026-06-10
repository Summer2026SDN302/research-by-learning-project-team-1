const SystemActivity = require('../models/SystemActivity');
const ApiError = require('../utils/apiError');
const { PAGINATION } = require('../config/constants');

const logActivity = async ({ actor, action, resourceType, resourceId, metadata, ipAddress, userAgent, severity }) => {
    return SystemActivity.create({
        actor: actor || null,
        action,
        resourceType,
        resourceId: resourceId || null,
        metadata: metadata || {},
        ipAddress: ipAddress || '',
        userAgent: userAgent || '',
        severity: severity || 'info',
    });
};

const getActivities = async ({
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    action,
    resourceType,
    severity,
    actor,
    from,
    to,
}) => {
    const query = {};

    if (action) query.action = action;
    if (resourceType) query.resourceType = resourceType;
    if (severity) query.severity = severity;
    if (actor) query.actor = actor;

    if (from || to) {
        query.createdAt = {};
        if (from) query.createdAt.$gte = new Date(from);
        if (to) query.createdAt.$lte = new Date(to);
    }

    const safePage = Math.max(1, parseInt(page, 10));
    const safeLimit = Math.min(Math.max(1, parseInt(limit, 10)), PAGINATION.MAX_LIMIT);
    const skip = (safePage - 1) * safeLimit;

    const [activities, total] = await Promise.all([
        SystemActivity.find(query)
            .populate('actor', 'name email role')
            .skip(skip)
            .limit(safeLimit)
            .sort({ createdAt: -1 })
            .lean(),
        SystemActivity.countDocuments(query),
    ]);

    return {
        activities,
        pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) },
    };
};

const getStats = async () => {
    const [totalActivities, bySeverity, byResourceType, recentActions] = await Promise.all([
        SystemActivity.countDocuments(),
        SystemActivity.aggregate([
            { $group: { _id: '$severity', count: { $sum: 1 } } },
        ]),
        SystemActivity.aggregate([
            { $group: { _id: '$resourceType', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]),
        SystemActivity.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('actor', 'name email')
            .lean(),
    ]);

    const severityMap = {};
    for (const s of bySeverity) {
        severityMap[s._id] = s.count;
    }

    return {
        totalActivities,
        bySeverity: severityMap,
        byResourceType,
        recentActions,
    };
};

module.exports = {
    logActivity,
    getActivities,
    getStats,
};
