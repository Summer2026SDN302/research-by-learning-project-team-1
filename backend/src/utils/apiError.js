class ApiError extends Error {
    constructor(statusCode, message, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.name = 'ApiError';
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message = 'Yêu cầu không hợp lệ', errors = []) {
        return new ApiError(400, message, errors);
    }

    static unauthorized(message = 'Chưa được xác thực') {
        return new ApiError(401, message);
    }

    static forbidden(message = 'Không có quyền truy cập') {
        return new ApiError(403, message);
    }

    static notFound(message = 'Không tìm thấy tài nguyên') {
        return new ApiError(404, message);
    }

    static conflict(message = 'Dữ liệu bị trùng hoặc xung đột') {
        return new ApiError(409, message);
    }
}

module.exports = ApiError;
