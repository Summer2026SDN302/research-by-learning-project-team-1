const quizService = require('../services/quizService');
const ApiResponse = require('../utils/apiResponse');

const createQuiz = async (req, res, next) => {
    try {
        const quiz = await quizService.createQuiz(req.user.id, req.body);
        return ApiResponse.success(res, { quiz }, 'Tạo bài quiz thành công', 201);
    } catch (error) {
        next(error);
    }
};

const getQuizzes = async (req, res, next) => {
    try {
        const { page, limit, search, course, difficulty, isPublished, createdBy } = req.query;
        const result = await quizService.getQuizzes({
            page, limit, search, course, difficulty,
            isPublished: isPublished !== undefined ? isPublished === 'true' : undefined,
            createdBy,
        });
        return ApiResponse.paginated(res, result.quizzes, result.pagination.page, result.pagination.limit, result.pagination.total, 'Lấy danh sách quiz thành công');
    } catch (error) {
        next(error);
    }
};

const getQuizById = async (req, res, next) => {
    try {
        const quiz = await quizService.getQuizById(req.params.id, req.user.id, req.user.role);
        return ApiResponse.success(res, { quiz }, 'Lấy thông tin quiz thành công');
    } catch (error) {
        next(error);
    }
};

const updateQuiz = async (req, res, next) => {
    try {
        const quiz = await quizService.updateQuiz(req.params.id, req.user.id, req.user.role, req.body);
        return ApiResponse.success(res, { quiz }, 'Cập nhật quiz thành công');
    } catch (error) {
        next(error);
    }
};

const deleteQuiz = async (req, res, next) => {
    try {
        await quizService.deleteQuiz(req.params.id, req.user.id, req.user.role);
        return ApiResponse.success(res, null, 'Xóa quiz thành công');
    } catch (error) {
        next(error);
    }
};

const submitAttempt = async (req, res, next) => {
    try {
        const { answers } = req.body;
        const attempt = await quizService.submitAttempt(req.params.id, req.user.id, answers);
        return ApiResponse.success(res, { attempt }, 'Nộp bài quiz thành công');
    } catch (error) {
        next(error);
    }
};

const getAttempts = async (req, res, next) => {
    try {
        const attempts = await quizService.getAttempts(req.params.id, req.user.id);
        return ApiResponse.success(res, { attempts }, 'Lấy lịch sử làm quiz thành công');
    } catch (error) {
        next(error);
    }
};

const getAttemptDetail = async (req, res, next) => {
    try {
        const attempt = await quizService.getAttemptDetail(req.params.attemptId, req.user.id, req.user.role);
        return ApiResponse.success(res, { attempt }, 'Lấy chi tiết kết quả thành công');
    } catch (error) {
        next(error);
    }
};

const getMyAttempts = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const result = await quizService.getMyAttempts(req.user.id, { page, limit });
        return ApiResponse.paginated(res, result.attempts, result.pagination.page, result.pagination.limit, result.pagination.total, 'Lấy lịch sử quiz của bạn thành công');
    } catch (error) {
        next(error);
    }
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
