const TeamTask = require('../models/TeamTask');
const TeamDocument = require('../models/TeamDocument');
const TeamLink = require('../models/TeamLink');
const TeamMessage = require('../models/TeamMessage');
const Team = require('../models/Team');
const ApiError = require('../utils/apiError');
const { PAGINATION } = require('../config/constants');

const MEMBER_FIELDS = 'name email avatar';

const assertTeamMember = async (teamId, userId) => {
    const team = await Team.findById(teamId);

    if (!team) {
        throw ApiError.notFound('Không tìm thấy nhóm');
    }

    if (!team.members.some((m) => m.toString() === userId)) {
        throw ApiError.forbidden('Bạn không phải thành viên của nhóm này');
    }

    return team;
};

const createTask = async (teamId, userId, taskData) => {
    await assertTeamMember(teamId, userId);

    const task = await TeamTask.create({
        ...taskData,
        team: teamId,
        createdBy: userId,
    });

    return TeamTask.findById(task._id)
        .populate('createdBy', MEMBER_FIELDS)
        .populate('assignees', MEMBER_FIELDS);
};

const getTasks = async (teamId, userId, { status, priority, assignee }) => {
    await assertTeamMember(teamId, userId);

    const query = { team: teamId };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignee) query.assignees = assignee;

    return TeamTask.find(query)
        .populate('createdBy', MEMBER_FIELDS)
        .populate('assignees', MEMBER_FIELDS)
        .sort({ createdAt: -1 })
        .lean();
};

const updateTask = async (teamId, taskId, userId, updateData) => {
    await assertTeamMember(teamId, userId);

    const task = await TeamTask.findOne({ _id: taskId, team: teamId });

    if (!task) {
        throw ApiError.notFound('Không tìm thấy công việc');
    }

    const { title, description, assignees, status, priority, dueAt } = updateData;
    const allowedUpdates = {};

    if (title !== undefined) allowedUpdates.title = title;
    if (description !== undefined) allowedUpdates.description = description;
    if (assignees !== undefined) allowedUpdates.assignees = assignees;
    if (status !== undefined) {
        allowedUpdates.status = status;
        if (status === 'done') allowedUpdates.completedAt = new Date();
        if (status !== 'done') allowedUpdates.completedAt = null;
    }
    if (priority !== undefined) allowedUpdates.priority = priority;
    if (dueAt !== undefined) allowedUpdates.dueAt = dueAt;

    return TeamTask.findByIdAndUpdate(taskId, allowedUpdates, { new: true, runValidators: true })
        .populate('createdBy', MEMBER_FIELDS)
        .populate('assignees', MEMBER_FIELDS);
};

const deleteTask = async (teamId, taskId, userId) => {
    await assertTeamMember(teamId, userId);

    const task = await TeamTask.findOneAndDelete({ _id: taskId, team: teamId });

    if (!task) {
        throw ApiError.notFound('Không tìm thấy công việc');
    }
};

const uploadDocument = async (teamId, userId, docData) => {
    await assertTeamMember(teamId, userId);

    const doc = await TeamDocument.create({
        ...docData,
        team: teamId,
        uploadedBy: userId,
    });

    return TeamDocument.findById(doc._id)
        .populate('uploadedBy', MEMBER_FIELDS);
};

const getDocuments = async (teamId, userId, { category }) => {
    await assertTeamMember(teamId, userId);

    const query = { team: teamId };
    if (category) query.category = category;

    return TeamDocument.find(query)
        .populate('uploadedBy', MEMBER_FIELDS)
        .sort({ createdAt: -1 })
        .lean();
};

const updateDocument = async (teamId, docId, userId, updateData) => {
    await assertTeamMember(teamId, userId);

    const doc = await TeamDocument.findOne({ _id: docId, team: teamId });

    if (!doc) {
        throw ApiError.notFound('Không tìm thấy tài liệu');
    }

    if (doc.uploadedBy.toString() !== userId) {
        throw ApiError.forbidden('Chỉ người tải lên mới có thể sửa');
    }

    const { title, description, category } = updateData;
    const allowedUpdates = {};

    if (title !== undefined) allowedUpdates.title = title;
    if (description !== undefined) allowedUpdates.description = description;
    if (category !== undefined) allowedUpdates.category = category;

    return TeamDocument.findByIdAndUpdate(docId, allowedUpdates, { new: true, runValidators: true })
        .populate('uploadedBy', MEMBER_FIELDS);
};

const deleteDocument = async (teamId, docId, userId) => {
    await assertTeamMember(teamId, userId);

    const doc = await TeamDocument.findOne({ _id: docId, team: teamId });

    if (!doc) {
        throw ApiError.notFound('Không tìm thấy tài liệu');
    }

    if (doc.uploadedBy.toString() !== userId) {
        const team = await Team.findById(teamId);
        if (team.leader.toString() !== userId) {
            throw ApiError.forbidden('Chỉ người tải lên hoặc trưởng nhóm mới có thể xóa');
        }
    }

    await TeamDocument.findByIdAndDelete(docId);
};

const createLink = async (teamId, userId, linkData) => {
    await assertTeamMember(teamId, userId);

    const link = await TeamLink.create({
        ...linkData,
        team: teamId,
        createdBy: userId,
    });

    return TeamLink.findById(link._id).populate('createdBy', MEMBER_FIELDS);
};

const getLinks = async (teamId, userId, { type }) => {
    await assertTeamMember(teamId, userId);

    const query = { team: teamId };
    if (type) query.type = type;

    return TeamLink.find(query)
        .populate('createdBy', MEMBER_FIELDS)
        .sort({ createdAt: -1 })
        .lean();
};

const updateLink = async (teamId, linkId, userId, updateData) => {
    await assertTeamMember(teamId, userId);

    const link = await TeamLink.findOne({ _id: linkId, team: teamId });

    if (!link) {
        throw ApiError.notFound('Không tìm thấy liên kết');
    }

    const { title, url, description, type } = updateData;
    const allowedUpdates = {};

    if (title !== undefined) allowedUpdates.title = title;
    if (url !== undefined) allowedUpdates.url = url;
    if (description !== undefined) allowedUpdates.description = description;
    if (type !== undefined) allowedUpdates.type = type;

    return TeamLink.findByIdAndUpdate(linkId, allowedUpdates, { new: true, runValidators: true })
        .populate('createdBy', MEMBER_FIELDS);
};

const deleteLink = async (teamId, linkId, userId) => {
    await assertTeamMember(teamId, userId);

    const link = await TeamLink.findOneAndDelete({ _id: linkId, team: teamId });

    if (!link) {
        throw ApiError.notFound('Không tìm thấy liên kết');
    }
};

const sendMessage = async (teamId, userId, content, attachments) => {
    await assertTeamMember(teamId, userId);

    const message = await TeamMessage.create({
        team: teamId,
        sender: userId,
        content,
        attachments: attachments || [],
    });

    return TeamMessage.findById(message._id).populate('sender', MEMBER_FIELDS);
};

const getMessages = async (teamId, userId, {
    page = PAGINATION.DEFAULT_PAGE,
    limit = 50,
}) => {
    await assertTeamMember(teamId, userId);

    const safePage = Math.max(1, parseInt(page, 10));
    const safeLimit = Math.min(Math.max(1, parseInt(limit, 10)), 100);
    const skip = (safePage - 1) * safeLimit;

    const [messages, total] = await Promise.all([
        TeamMessage.find({ team: teamId })
            .populate('sender', MEMBER_FIELDS)
            .skip(skip)
            .limit(safeLimit)
            .sort({ createdAt: -1 })
            .lean(),
        TeamMessage.countDocuments({ team: teamId }),
    ]);

    return {
        messages: messages.reverse(),
        pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) },
    };
};

const editMessage = async (teamId, messageId, userId, content) => {
    const message = await TeamMessage.findOne({ _id: messageId, team: teamId });

    if (!message) {
        throw ApiError.notFound('Không tìm thấy tin nhắn');
    }

    if (message.sender.toString() !== userId) {
        throw ApiError.forbidden('Chỉ người gửi mới có thể sửa');
    }

    message.content = content;
    message.editedAt = new Date();
    await message.save();

    return TeamMessage.findById(message._id).populate('sender', MEMBER_FIELDS);
};

const pinMessage = async (teamId, messageId, userId) => {
    await assertTeamMember(teamId, userId);

    const message = await TeamMessage.findOne({ _id: messageId, team: teamId });

    if (!message) {
        throw ApiError.notFound('Không tìm thấy tin nhắn');
    }

    message.isPinned = !message.isPinned;
    await message.save();

    return message;
};

const deleteMessage = async (teamId, messageId, userId) => {
    const message = await TeamMessage.findOne({ _id: messageId, team: teamId });

    if (!message) {
        throw ApiError.notFound('Không tìm thấy tin nhắn');
    }

    if (message.sender.toString() !== userId) {
        const team = await Team.findById(teamId);
        if (team.leader.toString() !== userId) {
            throw ApiError.forbidden('Chỉ người gửi hoặc trưởng nhóm mới có thể xóa');
        }
    }

    await TeamMessage.findByIdAndDelete(messageId);
};

const getWorkspaceOverview = async (teamId, userId) => {
    await assertTeamMember(teamId, userId);

    const [tasks, documents, links, pinnedMessages] = await Promise.all([
        TeamTask.find({ team: teamId })
            .populate('assignees', MEMBER_FIELDS)
            .populate('createdBy', MEMBER_FIELDS)
            .sort({ createdAt: -1 })
            .lean(),
        TeamDocument.find({ team: teamId })
            .populate('uploadedBy', MEMBER_FIELDS)
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(),
        TeamLink.find({ team: teamId })
            .populate('createdBy', MEMBER_FIELDS)
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(),
        TeamMessage.find({ team: teamId, isPinned: true })
            .populate('sender', MEMBER_FIELDS)
            .sort({ createdAt: -1 })
            .lean(),
    ]);

    const taskStats = {
        total: tasks.length,
        todo: tasks.filter((t) => t.status === 'todo').length,
        inProgress: tasks.filter((t) => t.status === 'in_progress').length,
        review: tasks.filter((t) => t.status === 'review').length,
        done: tasks.filter((t) => t.status === 'done').length,
    };

    return { tasks, taskStats, documents, links, pinnedMessages };
};

module.exports = {
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
    getWorkspaceOverview,
};
