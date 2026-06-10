const LearningMaterial = require('../models/LearningMaterial');
const ApiError = require('../utils/apiError');
const { PAGINATION } = require('../config/constants');

const createMaterial = async (userId, materialData) => {
    const material = await LearningMaterial.create({
        ...materialData,
        uploadedBy: userId,
    });

    return LearningMaterial.findById(material._id)
        .populate('course', 'code name')
        .populate('uploadedBy', 'name email avatar');
};

const getMaterials = async ({
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    search,
    course,
    tags,
    visibility,
}) => {
    const query = {};

    if (course) {
        query.course = course;
    }

    if (visibility) {
        query.visibility = visibility;
    }

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    if (tags?.length) {
        query.tags = { $in: tags };
    }

    const safePage = Math.max(1, parseInt(page, 10));
    const safeLimit = Math.min(
        Math.max(1, parseInt(limit, 10)),
        PAGINATION.MAX_LIMIT
    );
    const skip = (safePage - 1) * safeLimit;

    const [materials, total] = await Promise.all([
        LearningMaterial.find(query)
            .populate('course', 'code name')
            .populate('uploadedBy', 'name email avatar')
            .skip(skip)
            .limit(safeLimit)
            .sort({ createdAt: -1 })
            .lean(),
        LearningMaterial.countDocuments(query),
    ]);

    return {
        materials,
        pagination: {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages: Math.ceil(total / safeLimit),
        },
    };
};

const getMaterialById = async (materialId) => {
    const material = await LearningMaterial.findById(materialId)
        .populate('course', 'code name')
        .populate('uploadedBy', 'name email avatar');

    if (!material) {
        throw ApiError.notFound('Không tìm thấy tài liệu');
    }

    return material;
};

const updateMaterial = async (materialId, userId, userRole, updateData) => {
    const material = await LearningMaterial.findById(materialId);

    if (!material) {
        throw ApiError.notFound('Không tìm thấy tài liệu');
    }

    if (userRole !== 'admin' && material.uploadedBy.toString() !== userId.toString()) {
        throw ApiError.forbidden('Chỉ người tải lên hoặc quản trị viên mới có thể cập nhật');
    }

    const { title, description, tags, visibility } = updateData;
    const allowedUpdates = {};

    if (title !== undefined) allowedUpdates.title = title;
    if (description !== undefined) allowedUpdates.description = description;
    if (tags !== undefined) allowedUpdates.tags = tags;
    if (visibility !== undefined) allowedUpdates.visibility = visibility;

    const updated = await LearningMaterial.findByIdAndUpdate(materialId, allowedUpdates, {
        new: true,
        runValidators: true,
    })
        .populate('course', 'code name')
        .populate('uploadedBy', 'name email avatar');

    return updated;
};

const deleteMaterial = async (materialId, userId, userRole) => {
    const material = await LearningMaterial.findById(materialId);

    if (!material) {
        throw ApiError.notFound('Không tìm thấy tài liệu');
    }

    if (userRole !== 'admin' && material.uploadedBy.toString() !== userId.toString()) {
        throw ApiError.forbidden('Chỉ người tải lên hoặc quản trị viên mới có thể xóa');
    }

    await LearningMaterial.findByIdAndDelete(materialId);
};

const incrementDownload = async (materialId) => {
    const material = await LearningMaterial.findByIdAndUpdate(
        materialId,
        { $inc: { downloadCount: 1 } },
        { new: true }
    )
        .populate('course', 'code name')
        .populate('uploadedBy', 'name email avatar');

    if (!material) {
        throw ApiError.notFound('Không tìm thấy tài liệu');
    }

    return material;
};

module.exports = {
    createMaterial,
    getMaterials,
    getMaterialById,
    updateMaterial,
    deleteMaterial,
    incrementDownload,
};
