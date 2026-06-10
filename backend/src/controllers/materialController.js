const materialService = require('../services/materialService');
const ApiResponse = require('../utils/apiResponse');

const createMaterial = async (req, res, next) => {
    try {
        const material = await materialService.createMaterial(req.user.id, req.body);

        return ApiResponse.success(res, { material }, 'Tạo tài liệu thành công', 201);
    } catch (error) {
        next(error);
    }
};

const getMaterials = async (req, res, next) => {
    try {
        const { page, limit, search, course, tags, visibility } = req.query;
        const result = await materialService.getMaterials({
            page,
            limit,
            search,
            course,
            tags: tags ? tags.split(',') : undefined,
            visibility,
        });

        return ApiResponse.paginated(
            res,
            result.materials,
            result.pagination.page,
            result.pagination.limit,
            result.pagination.total,
            'Lấy danh sách tài liệu thành công'
        );
    } catch (error) {
        next(error);
    }
};

const getMaterialById = async (req, res, next) => {
    try {
        const material = await materialService.getMaterialById(req.params.id);

        return ApiResponse.success(res, { material }, 'Lấy thông tin tài liệu thành công');
    } catch (error) {
        next(error);
    }
};

const updateMaterial = async (req, res, next) => {
    try {
        const material = await materialService.updateMaterial(
            req.params.id,
            req.user.id,
            req.user.role,
            req.body
        );

        return ApiResponse.success(res, { material }, 'Cập nhật tài liệu thành công');
    } catch (error) {
        next(error);
    }
};

const deleteMaterial = async (req, res, next) => {
    try {
        await materialService.deleteMaterial(req.params.id, req.user.id, req.user.role);

        return ApiResponse.success(res, null, 'Xóa tài liệu thành công');
    } catch (error) {
        next(error);
    }
};

const downloadMaterial = async (req, res, next) => {
    try {
        const material = await materialService.incrementDownload(req.params.id);

        return ApiResponse.success(res, { material }, 'Tải tài liệu thành công');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createMaterial,
    getMaterials,
    getMaterialById,
    updateMaterial,
    deleteMaterial,
    downloadMaterial,
};
