const { body } = require('express-validator');

const createTeamRules = [
    body('name')
        .notEmpty()
        .withMessage('Vui lòng nhập tên nhóm')
        .isLength({ min: 3, max: 100 })
        .withMessage('Tên nhóm phải từ 3 đến 100 ký tự'),
    body('description')
        .notEmpty()
        .withMessage('Vui lòng nhập mô tả nhóm')
        .isLength({ max: 1000 })
        .withMessage('Mô tả không được vượt quá 1000 ký tự'),
    body('maxMembers')
        .optional()
        .isInt({ min: 2, max: 10 })
        .withMessage('Số thành viên tối đa phải từ 2 đến 10'),
    body('requiredSkills')
        .optional()
        .isArray()
        .withMessage('Kỹ năng cần có phải là một danh sách'),
    body('tags')
        .optional()
        .isArray()
        .withMessage('Thẻ chủ đề phải là một danh sách'),
];

const updateTeamRules = [
    body('name')
        .optional()
        .notEmpty()
        .withMessage('Tên nhóm không được để trống')
        .isLength({ min: 3, max: 100 })
        .withMessage('Tên nhóm phải từ 3 đến 100 ký tự'),
    body('description')
        .optional()
        .notEmpty()
        .withMessage('Mô tả không được để trống')
        .isLength({ max: 1000 })
        .withMessage('Mô tả không được vượt quá 1000 ký tự'),
    body('maxMembers')
        .optional()
        .isInt({ min: 2, max: 10 })
        .withMessage('Số thành viên tối đa phải từ 2 đến 10'),
    body('requiredSkills')
        .optional()
        .isArray()
        .withMessage('Kỹ năng cần có phải là một danh sách'),
    body('tags')
        .optional()
        .isArray()
        .withMessage('Thẻ chủ đề phải là một danh sách'),
];

const joinRequestRules = [
    body('message')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Tin nhắn không được vượt quá 500 ký tự'),
];

const handleJoinRequestRules = [
    body('status')
        .isIn(['accepted', 'rejected'])
        .withMessage('Trạng thái phải là accepted hoặc rejected'),
];

module.exports = {
    createTeamRules,
    updateTeamRules,
    joinRequestRules,
    handleJoinRequestRules,
};
