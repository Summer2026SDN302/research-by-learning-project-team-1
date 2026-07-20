const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createQuizSchema,
  updateQuizSchema,
  submitAttemptSchema,
  listQuizzesQuerySchema,
} = require('../validators/quiz.validator');
const quizController = require('../controllers/quiz.controller');

const router = express.Router();

router.use(protect);

router.get('/', validate(listQuizzesQuerySchema, 'query'), quizController.listQuizzes);
router.get('/attempts/mine', restrictTo('student'), quizController.listMyAttempts);
router.get('/:id', quizController.getQuiz);

router.post('/', restrictTo('lecturer', 'admin'), validate(createQuizSchema), quizController.createQuiz);
router.post('/:id/attempts', restrictTo('student'), validate(submitAttemptSchema), quizController.submitAttempt);
router.patch('/:id', restrictTo('lecturer', 'admin'), validate(updateQuizSchema), quizController.updateQuiz);
router.delete('/:id', restrictTo('lecturer', 'admin'), quizController.deleteQuiz);

module.exports = router;
