const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            throw ApiError.unauthorized('Thiếu mã truy cập');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        next(ApiError.unauthorized('Mã truy cập không hợp lệ hoặc đã hết hạn'));
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(ApiError.unauthorized('Vui lòng đăng nhập để tiếp tục'));
        }

        if (!roles.includes(req.user.role)) {
            return next(
                ApiError.forbidden(
                    `Vai trò '${req.user.role}' không có quyền truy cập tài nguyên này`
                )
            );
        }

        next();
    };
};

module.exports = { authenticate, authorize };
