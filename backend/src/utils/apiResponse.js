class ApiResponse {
    static success(res, data, message = 'Thành công', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    static error(res, message = 'Lỗi hệ thống', statusCode = 500, errors = null) {
        const body = {
            success: false,
            message
        };

        if (errors) {
            body.errors = errors;
        }

        return res.status(statusCode).json(body);
    }

    static paginated(res, data, page, limit, total, message = 'Thành công') {
        return res.status(200).json({
            success: true,
            message,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    }
}

module.exports = ApiResponse;
