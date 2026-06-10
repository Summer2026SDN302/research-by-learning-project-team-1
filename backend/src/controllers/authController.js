const authService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
};

const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const result = await authService.register({ name, email, password, role });

        res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

        return ApiResponse.success(
            res,
            { user: result.user, accessToken: result.accessToken },
            'Đăng ký thành công',
            201
        );
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });

        res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

        return ApiResponse.success(
            res,
            { user: result.user, accessToken: result.accessToken },
            'Đăng nhập thành công'
        );
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        await authService.logout(req.user.id);

        res.clearCookie('refreshToken');

        return ApiResponse.success(res, null, 'Đăng xuất thành công');
    } catch (error) {
        next(error);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken: token } = req.cookies;
        const result = await authService.refreshAccessToken(token);

        return ApiResponse.success(
            res,
            { accessToken: result.accessToken },
            'Làm mới phiên đăng nhập thành công'
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    logout,
    refreshToken,
};
