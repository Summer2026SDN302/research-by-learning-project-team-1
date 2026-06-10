const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');

const generateAccessToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

const generateRefreshToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE,
    });
};

const register = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email }).lean();

    if (existingUser) {
        throw ApiError.conflict('Email đã được đăng ký');
    }

    const user = await User.create({ name, email, password, role: 'student' });

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    user.refreshToken = refreshToken;
    await user.save();

    const { password: _, refreshToken: __, ...userWithoutSensitive } = user.toObject();

    return { user: userWithoutSensitive, accessToken, refreshToken };
};

const login = async ({ email, password }) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw ApiError.unauthorized('Email hoặc mật khẩu không đúng');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw ApiError.unauthorized('Email hoặc mật khẩu không đúng');
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    user.refreshToken = refreshToken;
    await user.save();

    const { password: _, refreshToken: __, ...userWithoutSensitive } = user.toObject();

    return { user: userWithoutSensitive, accessToken, refreshToken };
};

const logout = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw ApiError.notFound('Không tìm thấy người dùng');
    }

    user.refreshToken = undefined;
    await user.save();
};

const refreshAccessToken = async (refreshToken) => {
    let decoded;

    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw ApiError.unauthorized('Phiên đăng nhập không hợp lệ');
    }

    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
        throw ApiError.unauthorized('Phiên đăng nhập không hợp lệ');
    }

    const accessToken = generateAccessToken(user._id, user.role);

    return { accessToken };
};

module.exports = {
    register,
    login,
    logout,
    refreshAccessToken,
    generateAccessToken,
    generateRefreshToken,
};
