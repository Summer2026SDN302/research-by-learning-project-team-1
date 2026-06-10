const { body } = require('express-validator');

const createTaskRules = [
    body('title').trim().notEmpty().withMessage('Tiêu đề là bắt buộc').isLength({ min: 2, max: 180 }).withMessage('Tiêu đề từ 2-180 ký tự'),
    body('description').optional().isLength({ max: 2000 }).withMessage('Mô tả tối đa 2000 ký tự'),
    body('status').optional().isIn(['todo', 'in_progress', 'review', 'done']).withMessage('Trạng thái không hợp lệ'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Mức ưu tiên không hợp lệ'),
];

const updateTaskRules = [
    body('title').optional().trim().isLength({ min: 2, max: 180 }).withMessage('Tiêu đề từ 2-180 ký tự'),
    body('status').optional().isIn(['todo', 'in_progress', 'review', 'done']).withMessage('Trạng thái không hợp lệ'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Mức ưu tiên không hợp lệ'),
];

const uploadDocRules = [
    body('title').trim().notEmpty().withMessage('Tiêu đề là bắt buộc').isLength({ min: 2, max: 180 }).withMessage('Tiêu đề từ 2-180 ký tự'),
    body('fileUrl').trim().notEmpty().withMessage('Đường dẫn tệp là bắt buộc'),
    body('fileName').trim().notEmpty().withMessage('Tên tệp là bắt buộc'),
    body('category').optional().isIn(['document', 'submission', 'reference', 'meeting_note', 'other']).withMessage('Loại tài liệu không hợp lệ'),
];

const createLinkRules = [
    body('title').trim().notEmpty().withMessage('Tiêu đề là bắt buộc').isLength({ min: 2, max: 180 }).withMessage('Tiêu đề từ 2-180 ký tự'),
    body('url').trim().notEmpty().withMessage('URL là bắt buộc'),
    body('type').optional().isIn(['meeting', 'repository', 'document', 'reference', 'prototype', 'other']).withMessage('Loại liên kết không hợp lệ'),
];

const sendMessageRules = [
    body('content').trim().notEmpty().withMessage('Nội dung tin nhắn là bắt buộc').isLength({ max: 3000 }).withMessage('Tin nhắn tối đa 3000 ký tự'),
];

module.exports = { createTaskRules, updateTaskRules, uploadDocRules, createLinkRules, sendMessageRules };
