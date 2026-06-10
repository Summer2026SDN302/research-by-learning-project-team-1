const Course = require('../models/Course');
const ApiError = require('../utils/apiError');
const { PAGINATION } = require('../config/constants');

const createCourse = async (lecturerId, courseData) => {
    const existing = await Course.findOne({ code: courseData.code?.toUpperCase() }).lean();

    if (existing) {
        throw ApiError.conflict('Mã môn học đã tồn tại');
    }

    const course = await Course.create({
        ...courseData,
        lecturer: lecturerId,
    });

    return Course.findById(course._id).populate('lecturer', 'name email avatar');
};

const getCourses = async ({
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    search,
    status,
    lecturer,
}) => {
    const query = {};

    if (status) {
        query.status = status;
    }

    if (lecturer) {
        query.lecturer = lecturer;
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { code: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    const safePage = Math.max(1, parseInt(page, 10));
    const safeLimit = Math.min(
        Math.max(1, parseInt(limit, 10)),
        PAGINATION.MAX_LIMIT
    );
    const skip = (safePage - 1) * safeLimit;

    const [courses, total] = await Promise.all([
        Course.find(query)
            .populate('lecturer', 'name email avatar')
            .skip(skip)
            .limit(safeLimit)
            .sort({ createdAt: -1 })
            .lean(),
        Course.countDocuments(query),
    ]);

    return {
        courses,
        pagination: {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages: Math.ceil(total / safeLimit),
        },
    };
};

const getCourseById = async (courseId) => {
    const course = await Course.findById(courseId)
        .populate('lecturer', 'name email avatar')
        .populate('students', 'name email avatar gpa skills major');

    if (!course) {
        throw ApiError.notFound('Không tìm thấy môn học');
    }

    return course;
};

const updateCourse = async (courseId, userId, userRole, updateData) => {
    const course = await Course.findById(courseId);

    if (!course) {
        throw ApiError.notFound('Không tìm thấy môn học');
    }

    if (userRole !== 'admin' && course.lecturer.toString() !== userId.toString()) {
        throw ApiError.forbidden('Chỉ giảng viên phụ trách hoặc quản trị viên mới có thể cập nhật');
    }

    const { name, description, semester, status } = updateData;
    const allowedUpdates = {};

    if (name !== undefined) allowedUpdates.name = name;
    if (description !== undefined) allowedUpdates.description = description;
    if (semester !== undefined) allowedUpdates.semester = semester;
    if (status !== undefined) allowedUpdates.status = status;

    const updated = await Course.findByIdAndUpdate(courseId, allowedUpdates, {
        new: true,
        runValidators: true,
    }).populate('lecturer', 'name email avatar');

    return updated;
};

const deleteCourse = async (courseId, userId, userRole) => {
    const course = await Course.findById(courseId);

    if (!course) {
        throw ApiError.notFound('Không tìm thấy môn học');
    }

    if (userRole !== 'admin' && course.lecturer.toString() !== userId.toString()) {
        throw ApiError.forbidden('Chỉ giảng viên phụ trách hoặc quản trị viên mới có thể xóa');
    }

    await Course.findByIdAndDelete(courseId);
};

const addStudentToCourse = async (courseId, studentId) => {
    const course = await Course.findById(courseId);

    if (!course) {
        throw ApiError.notFound('Không tìm thấy môn học');
    }

    if (course.students.some((id) => id.toString() === studentId)) {
        throw ApiError.badRequest('Sinh viên đã có trong môn học');
    }

    course.students.push(studentId);
    await course.save();

    return Course.findById(courseId)
        .populate('lecturer', 'name email avatar')
        .populate('students', 'name email avatar');
};

const removeStudentFromCourse = async (courseId, studentId) => {
    const course = await Course.findById(courseId);

    if (!course) {
        throw ApiError.notFound('Không tìm thấy môn học');
    }

    const index = course.students.findIndex((id) => id.toString() === studentId);

    if (index === -1) {
        throw ApiError.notFound('Sinh viên không có trong môn học');
    }

    course.students.splice(index, 1);
    await course.save();

    return Course.findById(courseId)
        .populate('lecturer', 'name email avatar')
        .populate('students', 'name email avatar');
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
