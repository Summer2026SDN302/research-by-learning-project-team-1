const { body } = require('express-validator');

const createEventRules = [
    body('title').trim().notEmpty().withMessage('Tiêu đề là bắt buộc').isLength({ min: 3, max: 180 }).withMessage('Tiêu đề từ 3-180 ký tự'),
    body('description').trim().notEmpty().withMessage('Mô tả là bắt buộc').isLength({ max: 5000 }).withMessage('Mô tả tối đa 5000 ký tự'),
    body('startAt').notEmpty().withMessage('Thời gian bắt đầu là bắt buộc').isISO8601().withMessage('Định dạng ngày không hợp lệ'),
    body('endAt').notEmpty().withMessage('Thời gian kết thúc là bắt buộc').isISO8601().withMessage('Định dạng ngày không hợp lệ'),
    body('capacity').optional().isInt({ min: 1 }).withMessage('Sức chứa tối thiểu 1'),
];

const updateEventRules = [
    body('title').optional().trim().isLength({ min: 3, max: 180 }).withMessage('Tiêu đề từ 3-180 ký tự'),
    body('description').optional().trim().isLength({ max: 5000 }).withMessage('Mô tả tối đa 5000 ký tự'),
    body('startAt').optional().isISO8601().withMessage('Định dạng ngày không hợp lệ'),
    body('endAt').optional().isISO8601().withMessage('Định dạng ngày không hợp lệ'),
    body('status').optional().isIn(['draft', 'published', 'cancelled', 'completed']).withMessage('Trạng thái không hợp lệ'),
];

module.exports = { createEventRules, updateEventRules };
