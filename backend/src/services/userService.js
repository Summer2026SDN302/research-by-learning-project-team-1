const User = require('../models/User');
const ApiError = require('../utils/apiError');
const { PAGINATION } = require('../config/constants');

const getProfile = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw ApiError.notFound('Không tìm thấy người dùng');
    }

    return user;
};

const updateProfile = async (userId, updateData) => {
    const { name, avatar, major, description } = updateData;
    const allowedUpdates = {};

    if (name !== undefined) allowedUpdates.name = name;
    if (avatar !== undefined) allowedUpdates.avatar = avatar;
    if (major !== undefined) allowedUpdates.major = major;
    if (description !== undefined) allowedUpdates.description = description;

    const user = await User.findByIdAndUpdate(userId, allowedUpdates, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        throw ApiError.notFound('Không tìm thấy người dùng');
    }

    return user;
};

const updateGpa = async (userId, gpa) => {
    if (gpa < 0 || gpa > 4) {
        throw ApiError.badRequest('GPA phải nằm trong khoảng từ 0 đến 4');
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { gpa },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw ApiError.notFound('Không tìm thấy người dùng');
    }

    return user;
};

const updateSkills = async (userId, skills) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { skills },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw ApiError.notFound('Không tìm thấy người dùng');
    }

    return user;
};

const updateInterests = async (userId, interests) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { interests },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw ApiError.notFound('Không tìm thấy người dùng');
    }

    return user;
};

const getAllStudents = async ({
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    search,
    major,
    skills,
}) => {
    const query = { role: 'student' };

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }

    if (major) {
        query.major = major;
    }

    if (skills?.length) {
        query.skills = { $in: skills };
    }

    const safePage = Math.max(1, parseInt(page, 10));
    const safeLimit = Math.min(
        Math.max(1, parseInt(limit, 10)),
        PAGINATION.MAX_LIMIT
    );
    const skip = (safePage - 1) * safeLimit;

    const [users, total] = await Promise.all([
        User.find(query)
            .select('-password')
            .skip(skip)
            .limit(safeLimit)
            .sort({ createdAt: -1 })
            .lean(),
        User.countDocuments(query),
    ]);

    return {
        users,
        pagination: {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages: Math.ceil(total / safeLimit),
        },
    };
};

module.exports = {
    getProfile,
    updateProfile,
    updateGpa,
    updateSkills,
    updateInterests,
    getAllStudents,
};
