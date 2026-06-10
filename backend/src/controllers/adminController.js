const adminService = require('../services/adminService');
const ApiResponse = require('../utils/apiResponse');

const getAllUsers = async (req, res, next) => {
    try {
        const { page, limit, search, role } = req.query;
        const result = await adminService.getAllUsers({ page, limit, search, role });

        return ApiResponse.paginated(
            res,
            result.users,
            result.pagination.page,
            result.pagination.limit,
            result.pagination.total,
            'Lấy danh sách người dùng thành công'
        );
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await adminService.getUserById(req.params.id);

        return ApiResponse.success(res, { user }, 'Lấy thông tin người dùng thành công');
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const user = await adminService.createUser(req.body);

        return ApiResponse.success(res, { user }, 'Tạo người dùng thành công', 201);
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await adminService.updateUser(req.params.id, req.body);

        return ApiResponse.success(res, { user }, 'Cập nhật người dùng thành công');
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        await adminService.deleteUser(req.params.id);

        return ApiResponse.success(res, null, 'Xóa người dùng thành công');
    } catch (error) {
        next(error);
    }
};

const changeUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        const user = await adminService.changeUserRole(req.params.id, role);

        return ApiResponse.success(res, { user }, 'Thay đổi vai trò thành công');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    changeUserRole,
};
