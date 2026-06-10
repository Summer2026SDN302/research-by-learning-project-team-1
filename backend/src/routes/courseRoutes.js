const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { createCourseRules, updateCourseRules } = require('../validators/courseValidator');
const validate = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);

router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);

router.post(
    '/',
    authorize('lecturer', 'admin'),
    createCourseRules,
    validate,
    courseController.createCourse
);
router.put(
    '/:id',
    authorize('lecturer', 'admin'),
    updateCourseRules,
    validate,
    courseController.updateCourse
);
router.delete(
    '/:id',
    authorize('lecturer', 'admin'),
    courseController.deleteCourse
);

router.post(
    '/:id/students/:studentId',
    authorize('lecturer', 'admin'),
    courseController.addStudentToCourse
);
router.delete(
    '/:id/students/:studentId',
    authorize('lecturer', 'admin'),
    courseController.removeStudentFromCourse
);

module.exports = router;
