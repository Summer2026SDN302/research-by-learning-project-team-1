const { body, param } = require('express-validator');

const createCourseRules = [
    body('code')
        .trim()
        .notEmpty()
        .withMessage('Mã môn học là bắt buộc')
        .isLength({ min: 2, max: 20 })
        .withMessage('Mã môn học từ 2-20 ký tự'),
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Tên môn học là bắt buộc')
        .isLength({ min: 2, max: 150 })
        .withMessage('Tên môn học từ 2-150 ký tự'),
    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Mô tả tối đa 1000 ký tự'),
    body('semester')
        .optional()
        .trim(),
];

const updateCourseRules = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 150 })
        .withMessage('Tên môn học từ 2-150 ký tự'),
    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Mô tả tối đa 1000 ký tự'),
    body('status')
        .optional()
        .isIn(['active', 'archived', 'draft'])
        .withMessage('Trạng thái phải là active, archived hoặc draft'),
];

module.exports = {
    createCourseRules,
    updateCourseRules,
};
