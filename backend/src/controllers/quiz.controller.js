const asyncHandler = require('../utils/async-handler');
const quizService = require('../services/quiz.service');

const createQuiz = asyncHandler(async (req, res) => {
  const quiz = await quizService.createQuiz(req.user.id, req.body);
  res.status(201).json({ success: true, data: { quiz } });
});

const listQuizzes = asyncHandler(async (req, res) => {
  const result = await quizService.listQuizzes(req.query, req.user);
  res.status(200).json({ success: true, ...result });
});

const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await quizService.getQuizForTaking(req.params.id, req.user);
  res.status(200).json({ success: true, data: { quiz } });
});

const submitAttempt = asyncHandler(async (req, res) => {
  const result = await quizService.submitAttempt(req.params.id, req.user.id, req.body.answers);
  res.status(201).json({ success: true, data: result });
});

const listMyAttempts = asyncHandler(async (req, res) => {
  const result = await quizService.listMyAttempts(req.user.id, req.query);
  res.status(200).json({ success: true, ...result });
});

const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await quizService.updateQuiz(req.params.id, req.user, req.body);
  res.status(200).json({ success: true, data: { quiz } });
});

const deleteQuiz = asyncHandler(async (req, res) => {
  await quizService.deleteQuiz(req.params.id, req.user);
  res.status(204).send();
});

module.exports = {
  createQuiz,
  listQuizzes,
  getQuiz,
  submitAttempt,
  listMyAttempts,
  updateQuiz,
  deleteQuiz,
};
