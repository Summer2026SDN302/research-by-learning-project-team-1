const workspaceService = require('../services/workspaceService');
const ApiResponse = require('../utils/apiResponse');

const getWorkspaceOverview = async (req, res, next) => {
    try {
        const data = await workspaceService.getWorkspaceOverview(req.params.teamId, req.user.id);
        return ApiResponse.success(res, data, 'Lấy tổng quan workspace thành công');
    } catch (error) {
        next(error);
    }
};

const createTask = async (req, res, next) => {
    try {
        const task = await workspaceService.createTask(req.params.teamId, req.user.id, req.body);
        return ApiResponse.success(res, { task }, 'Tạo công việc thành công', 201);
    } catch (error) {
        next(error);
    }
};

const getTasks = async (req, res, next) => {
    try {
        const { status, priority, assignee } = req.query;
        const tasks = await workspaceService.getTasks(req.params.teamId, req.user.id, { status, priority, assignee });
        return ApiResponse.success(res, { tasks }, 'Lấy danh sách công việc thành công');
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
        const task = await workspaceService.updateTask(req.params.teamId, req.params.taskId, req.user.id, req.body);
        return ApiResponse.success(res, { task }, 'Cập nhật công việc thành công');
    } catch (error) {
        next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        await workspaceService.deleteTask(req.params.teamId, req.params.taskId, req.user.id);
        return ApiResponse.success(res, null, 'Xóa công việc thành công');
    } catch (error) {
        next(error);
    }
};

const uploadDocument = async (req, res, next) => {
    try {
        const doc = await workspaceService.uploadDocument(req.params.teamId, req.user.id, req.body);
        return ApiResponse.success(res, { document: doc }, 'Tải lên tài liệu thành công', 201);
    } catch (error) {
        next(error);
    }
};

const getDocuments = async (req, res, next) => {
    try {
        const { category } = req.query;
        const documents = await workspaceService.getDocuments(req.params.teamId, req.user.id, { category });
        return ApiResponse.success(res, { documents }, 'Lấy danh sách tài liệu thành công');
    } catch (error) {
        next(error);
    }
};

const updateDocument = async (req, res, next) => {
    try {
        const doc = await workspaceService.updateDocument(req.params.teamId, req.params.docId, req.user.id, req.body);
        return ApiResponse.success(res, { document: doc }, 'Cập nhật tài liệu thành công');
    } catch (error) {
        next(error);
    }
};

const deleteDocument = async (req, res, next) => {
    try {
        await workspaceService.deleteDocument(req.params.teamId, req.params.docId, req.user.id);
        return ApiResponse.success(res, null, 'Xóa tài liệu thành công');
    } catch (error) {
        next(error);
    }
};

const createLink = async (req, res, next) => {
    try {
        const link = await workspaceService.createLink(req.params.teamId, req.user.id, req.body);
        return ApiResponse.success(res, { link }, 'Thêm liên kết thành công', 201);
    } catch (error) {
        next(error);
    }
};

const getLinks = async (req, res, next) => {
    try {
        const { type } = req.query;
        const links = await workspaceService.getLinks(req.params.teamId, req.user.id, { type });
        return ApiResponse.success(res, { links }, 'Lấy danh sách liên kết thành công');
    } catch (error) {
        next(error);
    }
};

const updateLink = async (req, res, next) => {
    try {
        const link = await workspaceService.updateLink(req.params.teamId, req.params.linkId, req.user.id, req.body);
        return ApiResponse.success(res, { link }, 'Cập nhật liên kết thành công');
    } catch (error) {
        next(error);
    }
};

const deleteLink = async (req, res, next) => {
    try {
        await workspaceService.deleteLink(req.params.teamId, req.params.linkId, req.user.id);
        return ApiResponse.success(res, null, 'Xóa liên kết thành công');
    } catch (error) {
        next(error);
    }
};

const sendMessage = async (req, res, next) => {
    try {
        const { content, attachments } = req.body;
        const message = await workspaceService.sendMessage(req.params.teamId, req.user.id, content, attachments);
        return ApiResponse.success(res, { message }, 'Gửi tin nhắn thành công', 201);
    } catch (error) {
        next(error);
    }
};

const getMessages = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const result = await workspaceService.getMessages(req.params.teamId, req.user.id, { page, limit });
        return ApiResponse.paginated(res, result.messages, result.pagination.page, result.pagination.limit, result.pagination.total, 'Lấy tin nhắn thành công');
    } catch (error) {
        next(error);
    }
};

const editMessage = async (req, res, next) => {
    try {
        const { content } = req.body;
        const message = await workspaceService.editMessage(req.params.teamId, req.params.messageId, req.user.id, content);
        return ApiResponse.success(res, { message }, 'Đã sửa tin nhắn');
    } catch (error) {
        next(error);
    }
};

const pinMessage = async (req, res, next) => {
    try {
        const message = await workspaceService.pinMessage(req.params.teamId, req.params.messageId, req.user.id);
        return ApiResponse.success(res, { message }, message.isPinned ? 'Đã ghim tin nhắn' : 'Đã bỏ ghim tin nhắn');
    } catch (error) {
        next(error);
    }
};

const deleteMessage = async (req, res, next) => {
    try {
        await workspaceService.deleteMessage(req.params.teamId, req.params.messageId, req.user.id);
        return ApiResponse.success(res, null, 'Đã xóa tin nhắn');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getWorkspaceOverview,
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    uploadDocument,
    getDocuments,
    updateDocument,
    deleteDocument,
    createLink,
    getLinks,
    updateLink,
    deleteLink,
    sendMessage,
    getMessages,
    editMessage,
    pinMessage,
    deleteMessage,
};
