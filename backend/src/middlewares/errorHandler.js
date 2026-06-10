const ApiError = require('../utils/apiError');

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        const errors = err.errors.length > 0 ? err.errors : undefined;
        const response = {
            success: false,
            message: err.message
        };

        if (errors) {
            response.errors = errors;
        }

        if (process.env.NODE_ENV === 'development') {
            response.stack = err.stack;
        }

        return res.status(err.statusCode).json(response);
    }

    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message
        }));

        const response = {
            success: false,
            message: 'Dữ liệu không hợp lệ',
            errors
        };

        if (process.env.NODE_ENV === 'development') {
            response.stack = err.stack;
        }

        return res.status(400).json(response);
    }

    if (err.name === 'CastError') {
        const response = {
            success: false,
            message: 'Định dạng ID không hợp lệ'
        };

        if (process.env.NODE_ENV === 'development') {
            response.stack = err.stack;
        }

        return res.status(400).json(response);
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        const response = {
            success: false,
            message: `Giá trị đã tồn tại: ${field}`
        };

        if (process.env.NODE_ENV === 'development') {
            response.stack = err.stack;
        }

        return res.status(409).json(response);
    }

    const response = {
        success: false,
        message: 'Lỗi hệ thống'
    };

    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    return res.status(500).json(response);
};

module.exports = errorHandler;
