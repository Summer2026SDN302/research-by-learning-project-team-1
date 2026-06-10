const { body } = require('express-validator');

const createMaterialRules = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Tiêu đề tài liệu là bắt buộc')
        .isLength({ min: 3, max: 180 })
        .withMessage('Tiêu đề từ 3-180 ký tự'),
    body('course')
        .notEmpty()
        .withMessage('Môn học là bắt buộc')
        .isMongoId()
        .withMessage('Mã môn học không hợp lệ'),
    body('fileUrl')
        .trim()
        .notEmpty()
        .withMessage('Đường dẫn tệp là bắt buộc'),
    body('fileName')
        .trim()
        .notEmpty()
        .withMessage('Tên tệp là bắt buộc'),
    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Mô tả tối đa 1000 ký tự'),
    body('tags')
        .optional()
        .isArray()
        .withMessage('Thẻ phải là mảng'),
    body('visibility')
        .optional()
        .isIn(['course', 'public', 'private'])
        .withMessage('Quyền truy cập phải là course, public hoặc private'),
];

const updateMaterialRules = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 180 })
        .withMessage('Tiêu đề từ 3-180 ký tự'),
    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Mô tả tối đa 1000 ký tự'),
    body('tags')
        .optional()
        .isArray()
        .withMessage('Thẻ phải là mảng'),
    body('visibility')
        .optional()
        .isIn(['course', 'public', 'private'])
        .withMessage('Quyền truy cập phải là course, public hoặc private'),
];

module.exports = {
    createMaterialRules,
    updateMaterialRules,
};
