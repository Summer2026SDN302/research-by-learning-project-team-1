const courseService = require('../services/courseService');
const ApiResponse = require('../utils/apiResponse');

const createCourse = async (req, res, next) => {
    try {
        const course = await courseService.createCourse(req.user.id, req.body);

        return ApiResponse.success(res, { course }, 'Tạo môn học thành công', 201);
    } catch (error) {
        next(error);
    }
};

const getCourses = async (req, res, next) => {
    try {
        const { page, limit, search, status, lecturer } = req.query;
        const result = await courseService.getCourses({
            page,
            limit,
            search,
            status,
            lecturer,
        });

        return ApiResponse.paginated(
            res,
            result.courses,
            result.pagination.page,
            result.pagination.limit,
            result.pagination.total,
            'Lấy danh sách môn học thành công'
        );
    } catch (error) {
        next(error);
    }
};

const getCourseById = async (req, res, next) => {
    try {
        const course = await courseService.getCourseById(req.params.id);

        return ApiResponse.success(res, { course }, 'Lấy thông tin môn học thành công');
    } catch (error) {
        next(error);
    }
};

const updateCourse = async (req, res, next) => {
    try {
        const course = await courseService.updateCourse(
            req.params.id,
            req.user.id,
            req.user.role,
            req.body
        );

        return ApiResponse.success(res, { course }, 'Cập nhật môn học thành công');
    } catch (error) {
        next(error);
    }
};

const deleteCourse = async (req, res, next) => {
    try {
        await courseService.deleteCourse(req.params.id, req.user.id, req.user.role);

        return ApiResponse.success(res, null, 'Xóa môn học thành công');
    } catch (error) {
        next(error);
    }
};

const addStudentToCourse = async (req, res, next) => {
    try {
        const course = await courseService.addStudentToCourse(
            req.params.id,
            req.params.studentId
        );

        return ApiResponse.success(res, { course }, 'Thêm sinh viên vào môn học thành công');
    } catch (error) {
        next(error);
    }
};

const removeStudentFromCourse = async (req, res, next) => {
    try {
        const course = await courseService.removeStudentFromCourse(
            req.params.id,
            req.params.studentId
        );

        return ApiResponse.success(res, { course }, 'Xóa sinh viên khỏi môn học thành công');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    addStudentToCourse,
    removeStudentFromCourse,
};
