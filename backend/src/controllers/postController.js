const postService = require('../services/postService');
const ApiResponse = require('../utils/apiResponse');

const createPost = async (req, res, next) => {
    try {
        const post = await postService.createPost(req.user.id, req.body);
        return ApiResponse.success(res, { post }, 'Tạo bài viết thành công', 201);
    } catch (error) {
        next(error);
    }
};

const getPosts = async (req, res, next) => {
    try {
        const { page, limit, search, type, status, course } = req.query;
        const result = await postService.getPosts({
            page, limit, search, type, status, course, userRole: req.user.role,
        });
        return ApiResponse.paginated(res, result.posts, result.pagination.page, result.pagination.limit, result.pagination.total, 'Lấy danh sách bài viết thành công');
    } catch (error) {
        next(error);
    }
};

const getPostById = async (req, res, next) => {
    try {
        const post = await postService.getPostById(req.params.id);
        return ApiResponse.success(res, { post }, 'Lấy bài viết thành công');
    } catch (error) {
        next(error);
    }
};

const updatePost = async (req, res, next) => {
    try {
        const post = await postService.updatePost(req.params.id, req.user.id, req.user.role, req.body);
        return ApiResponse.success(res, { post }, 'Cập nhật bài viết thành công');
    } catch (error) {
        next(error);
    }
};

const deletePost = async (req, res, next) => {
    try {
        await postService.deletePost(req.params.id, req.user.id, req.user.role);
        return ApiResponse.success(res, null, 'Xóa bài viết thành công');
    } catch (error) {
        next(error);
    }
};

const toggleReaction = async (req, res, next) => {
    try {
        const { type } = req.body;
        const result = await postService.toggleReaction(req.params.id, req.user.id, type);
        return ApiResponse.success(res, result, result.toggled ? 'Đã thêm phản hồi' : 'Đã bỏ phản hồi');
    } catch (error) {
        next(error);
    }
};

const getUserReactions = async (req, res, next) => {
    try {
        const reactions = await postService.getUserReactions(req.params.id, req.user.id);
        return ApiResponse.success(res, { reactions }, 'Lấy phản hồi thành công');
    } catch (error) {
        next(error);
    }
};

const moderatePost = async (req, res, next) => {
    try {
        const { status } = req.body;
        const post = await postService.moderatePost(req.params.id, status);
        return ApiResponse.success(res, { post }, 'Đã kiểm duyệt bài viết');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    toggleReaction,
    getUserReactions,
    moderatePost,
};
