const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const ApiError = require('../utils/apiError');
const { PAGINATION } = require('../config/constants');

const createQuiz = async (userId, quizData) => {
    const quiz = await Quiz.create({
        ...quizData,
        createdBy: userId,
    });

    return Quiz.findById(quiz._id)
        .populate('course', 'code name')
        .populate('createdBy', 'name email');
};

const getQuizzes = async ({
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    search,
    course,
    difficulty,
    isPublished,
    createdBy,
}) => {
    const query = {};

    if (course) query.course = course;
    if (difficulty) query.difficulty = difficulty;
    if (isPublished !== undefined) query.isPublished = isPublished;
    if (createdBy) query.createdBy = createdBy;

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    const safePage = Math.max(1, parseInt(page, 10));
    const safeLimit = Math.min(Math.max(1, parseInt(limit, 10)), PAGINATION.MAX_LIMIT);
    const skip = (safePage - 1) * safeLimit;

    const [quizzes, total] = await Promise.all([
        Quiz.find(query)
            .populate('course', 'code name')
            .populate('createdBy', 'name email')
            .select('-questions.correctAnswer -questions.explanation')
            .skip(skip)
            .limit(safeLimit)
            .sort({ createdAt: -1 })
            .lean(),
        Quiz.countDocuments(query),
    ]);

    return {
        quizzes,
        pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) },
    };
};

const getQuizById = async (quizId, userId, userRole) => {
    const quiz = await Quiz.findById(quizId)
        .populate('course', 'code name')
        .populate('createdBy', 'name email')
        .populate('material', 'title');

    if (!quiz) {
        throw ApiError.notFound('Không tìm thấy bài quiz');
    }

    const isOwner = quiz.createdBy._id.toString() === userId;
    const isManager = ['lecturer', 'admin'].includes(userRole);

    if (!isOwner && !isManager && !quiz.isPublished) {
        throw ApiError.forbidden('Bài quiz chưa được công bố');
    }

    const result = quiz.toObject();

    if (!isOwner && !isManager) {
        result.questions = result.questions.map(({ correctAnswer, explanation, ...rest }) => rest);
    }

    return result;
};

const updateQuiz = async (quizId, userId, userRole, updateData) => {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
        throw ApiError.notFound('Không tìm thấy bài quiz');
    }

    if (userRole !== 'admin' && quiz.createdBy.toString() !== userId) {
        throw ApiError.forbidden('Chỉ người tạo hoặc quản trị viên mới có thể sửa');
    }

    const { title, description, questions, durationMinutes, difficulty, isPublished, course, material } = updateData;
    const allowedUpdates = {};

    if (title !== undefined) allowedUpdates.title = title;
    if (description !== undefined) allowedUpdates.description = description;
    if (questions !== undefined) allowedUpdates.questions = questions;
    if (durationMinutes !== undefined) allowedUpdates.durationMinutes = durationMinutes;
    if (difficulty !== undefined) allowedUpdates.difficulty = difficulty;
    if (isPublished !== undefined) allowedUpdates.isPublished = isPublished;
    if (course !== undefined) allowedUpdates.course = course;
    if (material !== undefined) allowedUpdates.material = material;

    return Quiz.findByIdAndUpdate(quizId, allowedUpdates, { new: true, runValidators: true })
        .populate('course', 'code name')
        .populate('createdBy', 'name email');
};

const deleteQuiz = async (quizId, userId, userRole) => {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
        throw ApiError.notFound('Không tìm thấy bài quiz');
    }

    if (userRole !== 'admin' && quiz.createdBy.toString() !== userId) {
        throw ApiError.forbidden('Chỉ người tạo hoặc quản trị viên mới có thể xóa');
    }

    await Promise.all([
        Quiz.findByIdAndDelete(quizId),
        QuizAttempt.deleteMany({ quiz: quizId }),
    ]);
};

const submitAttempt = async (quizId, studentId, answers) => {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
        throw ApiError.notFound('Không tìm thấy bài quiz');
    }

    if (!quiz.isPublished) {
        throw ApiError.badRequest('Bài quiz chưa được công bố');
    }

    const processedAnswers = [];
    let score = 0;
    const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);

    for (const answer of answers) {
        const question = quiz.questions.find(
            (q) => q._id.toString() === answer.questionId
        );

        if (!question) continue;

        const isCorrect = answer.selectedAnswer === question.correctAnswer;
        const pointsEarned = isCorrect ? (question.points || 1) : 0;

        if (isCorrect) score += pointsEarned;

        processedAnswers.push({
            questionId: answer.questionId,
            selectedAnswer: answer.selectedAnswer,
            isCorrect,
            pointsEarned,
        });
    }

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

    const attempt = await QuizAttempt.create({
        quiz: quizId,
        student: studentId,
        answers: processedAnswers,
        score,
        totalPoints,
        percentage,
        submittedAt: new Date(),
    });

    return QuizAttempt.findById(attempt._id).populate('quiz', 'title');
};

const getAttempts = async (quizId, studentId) => {
    return QuizAttempt.find({ quiz: quizId, student: studentId })
        .populate('quiz', 'title difficulty')
        .sort({ createdAt: -1 })
        .lean();
};

const getAttemptDetail = async (attemptId, studentId, userRole) => {
    const attempt = await QuizAttempt.findById(attemptId)
        .populate({
            path: 'quiz',
            populate: { path: 'course', select: 'code name' },
        });

    if (!attempt) {
        throw ApiError.notFound('Không tìm thấy kết quả');
    }

    if (attempt.student.toString() !== studentId && !['lecturer', 'admin'].includes(userRole)) {
        throw ApiError.forbidden('Không có quyền xem kết quả này');
    }

    return attempt;
};

const getMyAttempts = async (studentId, { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT }) => {
    const safePage = Math.max(1, parseInt(page, 10));
    const safeLimit = Math.min(Math.max(1, parseInt(limit, 10)), PAGINATION.MAX_LIMIT);
    const skip = (safePage - 1) * safeLimit;

    const [attempts, total] = await Promise.all([
        QuizAttempt.find({ student: studentId })
            .populate('quiz', 'title difficulty durationMinutes')
            .skip(skip)
            .limit(safeLimit)
            .sort({ createdAt: -1 })
            .lean(),
        QuizAttempt.countDocuments({ student: studentId }),
    ]);

    return {
        attempts,
        pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) },
    };
};

module.exports = {
    createQuiz,
    getQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    submitAttempt,
    getAttempts,
    getAttemptDetail,
    getMyAttempts,
};
