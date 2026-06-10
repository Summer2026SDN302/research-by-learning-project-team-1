const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { createQuizRules, updateQuizRules, submitAttemptRules } = require('../validators/quizValidator');
const validate = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);

router.get('/', quizController.getQuizzes);
router.get('/my-attempts', quizController.getMyAttempts);
router.get('/:id', quizController.getQuizById);
router.get('/:id/attempts', quizController.getAttempts);

router.post('/', authorize('lecturer', 'admin'), createQuizRules, validate, quizController.createQuiz);
router.put('/:id', authorize('lecturer', 'admin'), updateQuizRules, validate, quizController.updateQuiz);
router.delete('/:id', authorize('lecturer', 'admin'), quizController.deleteQuiz);

router.post('/:id/submit', submitAttemptRules, validate, quizController.submitAttempt);
router.get('/attempts/:attemptId', quizController.getAttemptDetail);

module.exports = router;
