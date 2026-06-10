const Team = require('../models/Team');
const JoinRequest = require('../models/JoinRequest');
const ApiError = require('../utils/apiError');
const { PAGINATION } = require('../config/constants');

const MEMBER_POPULATE_FIELDS = 'name email avatar skills major gpa';

const createTeam = async (leaderId, teamData) => {
    const team = await Team.create({
        ...teamData,
        leader: leaderId,
        members: [leaderId],
    });

    return Team.findById(team._id)
        .populate('leader', MEMBER_POPULATE_FIELDS)
        .populate('members', MEMBER_POPULATE_FIELDS);
};

const getTeamById = async (teamId) => {
    const team = await Team.findById(teamId)
        .populate('leader', MEMBER_POPULATE_FIELDS)
        .populate('members', MEMBER_POPULATE_FIELDS);

    if (!team) {
        throw ApiError.notFound('Không tìm thấy nhóm');
    }

    return team;
};

const updateTeam = async (teamId, userId, updateData) => {
    const team = await Team.findById(teamId);

    if (!team) {
        throw ApiError.notFound('Không tìm thấy nhóm');
    }

    if (team.leader.toString() !== userId.toString()) {
        throw ApiError.forbidden('Chỉ trưởng nhóm mới có thể cập nhật nhóm');
    }

    const { name, description, maxMembers, requiredSkills, tags, status, course } = updateData;
    const allowedUpdates = {};

    if (name !== undefined) allowedUpdates.name = name;
    if (description !== undefined) allowedUpdates.description = description;
    if (maxMembers !== undefined) allowedUpdates.maxMembers = maxMembers;
    if (requiredSkills !== undefined) allowedUpdates.requiredSkills = requiredSkills;
    if (tags !== undefined) allowedUpdates.tags = tags;
    if (status !== undefined) allowedUpdates.status = status;
    if (course !== undefined) allowedUpdates.course = course;

    const updatedTeam = await Team.findByIdAndUpdate(teamId, allowedUpdates, {
        new: true,
        runValidators: true,
    })
        .populate('leader', MEMBER_POPULATE_FIELDS)
        .populate('members', MEMBER_POPULATE_FIELDS);

    return updatedTeam;
};

const deleteTeam = async (teamId, userId) => {
    const team = await Team.findById(teamId);

    if (!team) {
        throw ApiError.notFound('Không tìm thấy nhóm');
    }

    if (team.leader.toString() !== userId.toString()) {
        throw ApiError.forbidden('Chỉ trưởng nhóm mới có thể xóa nhóm');
    }

    await Promise.all([
        Team.findByIdAndDelete(teamId),
        JoinRequest.deleteMany({ team: teamId }),
    ]);
};

const getTeams = async ({
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    status,
    search,
    skills,
    tags,
}) => {
    const query = {};

    if (status) {
        query.status = status;
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    if (skills?.length) {
        query.requiredSkills = { $in: skills };
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

    const [teams, total] = await Promise.all([
        Team.find(query)
            .populate('leader', 'name email avatar')
            .skip(skip)
            .limit(safeLimit)
            .sort({ createdAt: -1 })
            .lean(),
        Team.countDocuments(query),
    ]);

    return {
        teams,
        pagination: {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages: Math.ceil(total / safeLimit),
        },
    };
};

const getMyTeams = async (userId) => {
    const teams = await Team.find({ members: userId })
        .populate('leader', MEMBER_POPULATE_FIELDS)
        .sort({ createdAt: -1 })
        .lean();

    return teams;
};

const removeMember = async (teamId, leaderId, memberId) => {
    const team = await Team.findById(teamId);

    if (!team) {
        throw ApiError.notFound('Không tìm thấy nhóm');
    }

    if (team.leader.toString() !== leaderId.toString()) {
        throw ApiError.forbidden('Chỉ trưởng nhóm mới có thể xóa thành viên');
    }

    if (leaderId.toString() === memberId.toString()) {
        throw ApiError.badRequest('Trưởng nhóm không thể tự xóa mình khỏi nhóm');
    }

    const memberIndex = team.members.findIndex(
        (member) => member.toString() === memberId.toString()
    );

    if (memberIndex === -1) {
        throw ApiError.notFound('Không tìm thấy thành viên trong nhóm');
    }

    team.members.splice(memberIndex, 1);
    await team.save();

    return Team.findById(teamId)
        .populate('leader', MEMBER_POPULATE_FIELDS)
        .populate('members', MEMBER_POPULATE_FIELDS);
};

const leaveTeam = async (teamId, userId) => {
    const team = await Team.findById(teamId);

    if (!team) {
        throw ApiError.notFound('Không tìm thấy nhóm');
    }

    if (team.leader.toString() === userId.toString()) {
        throw ApiError.badRequest('Trưởng nhóm không thể rời nhóm. Vui lòng chuyển quyền trước');
    }

    const memberIndex = team.members.findIndex(
        (member) => member.toString() === userId.toString()
    );

    if (memberIndex === -1) {
        throw ApiError.badRequest('Bạn không phải là thành viên của nhóm này');
    }

    team.members.splice(memberIndex, 1);
    await team.save();

    return Team.findById(teamId)
        .populate('leader', MEMBER_POPULATE_FIELDS)
        .populate('members', MEMBER_POPULATE_FIELDS);
};

module.exports = {
    createTeam,
    getTeamById,
    updateTeam,
    deleteTeam,
    getTeams,
    getMyTeams,
    removeMember,
    leaveTeam,
};
