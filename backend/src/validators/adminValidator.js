const { body } = require('express-validator');

const createUserRules = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Họ và tên là bắt buộc')
        .isLength({ min: 2, max: 50 })
        .withMessage('Họ và tên từ 2-50 ký tự'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email là bắt buộc')
        .isEmail()
        .withMessage('Email không hợp lệ'),
    body('password')
        .notEmpty()
        .withMessage('Mật khẩu là bắt buộc')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu tối thiểu 6 ký tự')
        .matches(/[A-Z]/)
        .withMessage('Mật khẩu phải chứa ít nhất một chữ hoa')
        .matches(/\d/)
        .withMessage('Mật khẩu phải chứa ít nhất một chữ số'),
    body('role')
        .optional()
        .isIn(['student', 'lecturer', 'admin', 'club_leader'])
        .withMessage('Vai trò không hợp lệ'),
];

const updateUserRules = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Họ và tên từ 2-50 ký tự'),
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Email không hợp lệ'),
    body('role')
        .optional()
        .isIn(['student', 'lecturer', 'admin', 'club_leader'])
        .withMessage('Vai trò không hợp lệ'),
    body('gpa')
        .optional()
        .isFloat({ min: 0, max: 4 })
        .withMessage('GPA phải từ 0 đến 4'),
];

const changeRoleRules = [
    body('role')
        .notEmpty()
        .withMessage('Vai trò là bắt buộc')
        .isIn(['student', 'lecturer', 'admin', 'club_leader'])
        .withMessage('Vai trò không hợp lệ'),
];

module.exports = {
    createUserRules,
    updateUserRules,
    changeRoleRules,
};
