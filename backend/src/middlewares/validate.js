const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((err) => ({
            field: err.path,
            message: err.msg
        }));

        throw ApiError.badRequest('Dữ liệu không hợp lệ', formattedErrors);
    }

    next();
};

module.exports = validate;
