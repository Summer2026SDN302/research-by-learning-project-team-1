const { body } = require('express-validator');

const createPostRules = [
    body('title').trim().notEmpty().withMessage('Tiêu đề là bắt buộc').isLength({ min: 3, max: 180 }).withMessage('Tiêu đề từ 3-180 ký tự'),
    body('content').trim().notEmpty().withMessage('Nội dung là bắt buộc').isLength({ max: 5000 }).withMessage('Nội dung tối đa 5000 ký tự'),
    body('type').notEmpty().withMessage('Loại bài viết là bắt buộc').isIn(['announcement', 'academic_update', 'event_post', 'club_announcement']).withMessage('Loại bài viết không hợp lệ'),
];

const updatePostRules = [
    body('title').optional().trim().isLength({ min: 3, max: 180 }).withMessage('Tiêu đề từ 3-180 ký tự'),
    body('content').optional().trim().isLength({ max: 5000 }).withMessage('Nội dung tối đa 5000 ký tự'),
    body('status').optional().isIn(['draft', 'published', 'archived', 'moderated']).withMessage('Trạng thái không hợp lệ'),
];

const reactionRules = [
    body('type').notEmpty().withMessage('Loại phản hồi là bắt buộc').isIn(['like', 'love', 'useful', 'bookmark']).withMessage('Loại phản hồi không hợp lệ'),
];

const moderateRules = [
    body('status').notEmpty().withMessage('Trạng thái là bắt buộc').isIn(['draft', 'published', 'archived', 'moderated']).withMessage('Trạng thái không hợp lệ'),
];

module.exports = { createPostRules, updatePostRules, reactionRules, moderateRules };
