const { body } = require('express-validator');

const registerRules = [
    body('name')
        .notEmpty()
        .withMessage('Vui lòng nhập họ tên')
        .isLength({ min: 2, max: 50 })
        .withMessage('Họ tên phải từ 2 đến 50 ký tự'),
    body('email')
        .isEmail()
        .withMessage('Email không hợp lệ')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
        .matches(/(?=.*[A-Z])(?=.*[0-9])/)
        .withMessage('Mật khẩu phải có ít nhất một chữ hoa và một số'),
];

const loginRules = [
    body('email')
        .isEmail()
        .withMessage('Email không hợp lệ')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Vui lòng nhập mật khẩu'),
];

module.exports = {
    registerRules,
    loginRules,
};
