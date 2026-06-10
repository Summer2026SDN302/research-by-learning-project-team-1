const userService = require('../services/userService');
const ApiResponse = require('../utils/apiResponse');

const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getProfile(req.user.id);

        return ApiResponse.success(res, { user }, 'Lấy hồ sơ thành công');
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const { name, avatar, major, description } = req.body;
        const user = await userService.updateProfile(req.user.id, {
            name,
            avatar,
            major,
            description,
        });

        return ApiResponse.success(res, { user }, 'Cập nhật hồ sơ thành công');
    } catch (error) {
        next(error);
    }
};

const updateGpa = async (req, res, next) => {
    try {
        const { gpa } = req.body;
        const user = await userService.updateGpa(req.user.id, gpa);

        return ApiResponse.success(res, { user }, 'Cập nhật GPA thành công');
    } catch (error) {
        next(error);
    }
};

const updateSkills = async (req, res, next) => {
    try {
        const { skills } = req.body;
        const user = await userService.updateSkills(req.user.id, skills);

        return ApiResponse.success(res, { user }, 'Cập nhật kỹ năng thành công');
    } catch (error) {
        next(error);
    }
};

const updateInterests = async (req, res, next) => {
    try {
        const { interests } = req.body;
        const user = await userService.updateInterests(req.user.id, interests);

        return ApiResponse.success(res, { user }, 'Cập nhật sở thích thành công');
    } catch (error) {
        next(error);
    }
};

const getAllStudents = async (req, res, next) => {
    try {
        const { page, limit, search, major, skills } = req.query;
        const result = await userService.getAllStudents({
            page,
            limit,
            search,
            major,
            skills: skills ? skills.split(',') : undefined,
        });

        return ApiResponse.paginated(
            res,
            result.users,
            result.pagination.page,
            result.pagination.limit,
            result.pagination.total,
            'Lấy danh sách sinh viên thành công'
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    updateGpa,
    updateSkills,
    updateInterests,
    getAllStudents,
};
