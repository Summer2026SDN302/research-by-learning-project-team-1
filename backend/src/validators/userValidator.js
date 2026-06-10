const { body } = require('express-validator');

const updateProfileRules = [
    body('name')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Họ tên phải từ 2 đến 50 ký tự'),
    body('major')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Ngành học không được để trống'),
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Mô tả không được vượt quá 500 ký tự'),
];

const updateGpaRules = [
    body('gpa')
        .isFloat({ min: 0, max: 4 })
        .withMessage('GPA phải là số từ 0 đến 4'),
];

const updateSkillsRules = [
    body('skills')
        .isArray()
        .withMessage('Kỹ năng phải là một danh sách'),
    body('skills.*')
        .isString()
        .withMessage('Mỗi kỹ năng phải là chuỗi ký tự')
        .trim(),
];

const updateInterestsRules = [
    body('interests')
        .isArray()
        .withMessage('Sở thích phải là một danh sách'),
    body('interests.*')
        .isString()
        .withMessage('Mỗi sở thích phải là chuỗi ký tự')
        .trim(),
];

module.exports = {
    updateProfileRules,
    updateGpaRules,
    updateSkillsRules,
    updateInterestsRules,
};
