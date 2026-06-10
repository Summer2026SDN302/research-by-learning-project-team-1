const User = require('../models/User');
const ApiError = require('../utils/apiError');
const { PAGINATION } = require('../config/constants');

const getAllUsers = async ({
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    search,
    role,
}) => {
    const query = {};

    if (role) {
        query.role = role;
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }

    const safePage = Math.max(1, parseInt(page, 10));
    const safeLimit = Math.min(
        Math.max(1, parseInt(limit, 10)),
        PAGINATION.MAX_LIMIT
    );
    const skip = (safePage - 1) * safeLimit;

    const [users, total] = await Promise.all([
        User.find(query)
            .select('-password -refreshToken')
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

const getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password -refreshToken');

    if (!user) {
        throw ApiError.notFound('Không tìm thấy người dùng');
    }

    return user;
};

const createUser = async (userData) => {
    const existing = await User.findOne({ email: userData.email }).lean();

    if (existing) {
        throw ApiError.conflict('Email đã được đăng ký');
    }

    const user = await User.create(userData);
    const { password, refreshToken, ...result } = user.toObject();

    return result;
};

const updateUser = async (userId, updateData) => {
    const user = await User.findById(userId);

    if (!user) {
        throw ApiError.notFound('Không tìm thấy người dùng');
    }

    const { name, email, role, major, gpa, skills, interests, description } = updateData;
    const allowedUpdates = {};

    if (name !== undefined) allowedUpdates.name = name;
    if (email !== undefined) {
        const duplicate = await User.findOne({ email, _id: { $ne: userId } }).lean();
        if (duplicate) {
            throw ApiError.conflict('Email đã được sử dụng bởi tài khoản khác');
        }
        allowedUpdates.email = email;
    }
    if (role !== undefined) allowedUpdates.role = role;
    if (major !== undefined) allowedUpdates.major = major;
    if (gpa !== undefined) allowedUpdates.gpa = gpa;
    if (skills !== undefined) allowedUpdates.skills = skills;
    if (interests !== undefined) allowedUpdates.interests = interests;
    if (description !== undefined) allowedUpdates.description = description;

    const updated = await User.findByIdAndUpdate(userId, allowedUpdates, {
        new: true,
        runValidators: true,
    }).select('-password -refreshToken');

    return updated;
};

const deleteUser = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw ApiError.notFound('Không tìm thấy người dùng');
    }

    if (user.role === 'admin') {
        throw ApiError.badRequest('Không thể xóa tài khoản quản trị viên');
    }

    await User.findByIdAndDelete(userId);
};

const changeUserRole = async (userId, role) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
        throw ApiError.notFound('Không tìm thấy người dùng');
    }

    return user;
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    changeUserRole,
};
