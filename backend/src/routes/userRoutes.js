const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {
    updateProfileRules,
    updateGpaRules,
    updateSkillsRules,
    updateInterestsRules
} = require('../validators/userValidator');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileRules, validate, userController.updateProfile);
router.put('/gpa', updateGpaRules, validate, userController.updateGpa);
router.put('/skills', updateSkillsRules, validate, userController.updateSkills);
router.put('/interests', updateInterestsRules, validate, userController.updateInterests);
router.get('/students', userController.getAllStudents);

module.exports = router;
