const { body } = require('express-validator');

const createQuizRules = [
    body('title').trim().notEmpty().withMessage('Tiêu đề quiz là bắt buộc').isLength({ min: 3, max: 180 }).withMessage('Tiêu đề từ 3-180 ký tự'),
    body('questions').isArray({ min: 1 }).withMessage('Phải có ít nhất một câu hỏi'),
    body('questions.*.question').trim().notEmpty().withMessage('Nội dung câu hỏi là bắt buộc'),
    body('questions.*.options').isArray({ min: 2 }).withMessage('Mỗi câu hỏi phải có ít nhất 2 lựa chọn'),
    body('questions.*.correctAnswer').trim().notEmpty().withMessage('Đáp án đúng là bắt buộc'),
    body('durationMinutes').optional().isInt({ min: 1 }).withMessage('Thời gian tối thiểu 1 phút'),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Độ khó không hợp lệ'),
];

const updateQuizRules = [
    body('title').optional().trim().isLength({ min: 3, max: 180 }).withMessage('Tiêu đề từ 3-180 ký tự'),
    body('questions').optional().isArray({ min: 1 }).withMessage('Phải có ít nhất một câu hỏi'),
    body('durationMinutes').optional().isInt({ min: 1 }).withMessage('Thời gian tối thiểu 1 phút'),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Độ khó không hợp lệ'),
];

const submitAttemptRules = [
    body('answers').isArray({ min: 1 }).withMessage('Phải có ít nhất một câu trả lời'),
    body('answers.*.questionId').notEmpty().withMessage('ID câu hỏi là bắt buộc'),
    body('answers.*.selectedAnswer').notEmpty().withMessage('Phải chọn câu trả lời'),
];

module.exports = { createQuizRules, updateQuizRules, submitAttemptRules };
