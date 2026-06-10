const JoinRequest = require('../models/JoinRequest');
const Team = require('../models/Team');
const ApiError = require('../utils/apiError');

const MEMBER_POPULATE_FIELDS = 'name email avatar skills major gpa';

const sendJoinRequest = async (teamId, userId, message = '') => {
    const team = await Team.findById(teamId);

    if (!team) {
        throw ApiError.notFound('Không tìm thấy nhóm');
    }

    if (team.members.some((member) => member.toString() === userId.toString())) {
        throw ApiError.conflict('Bạn đã là thành viên của nhóm này');
    }

    if (team.members.length >= team.maxMembers) {
        throw ApiError.badRequest('Nhóm này đã đủ thành viên');
    }

    if (team.status !== 'open') {
        throw ApiError.badRequest('Nhóm này hiện không nhận yêu cầu tham gia');
    }

    return JoinRequest.create({
        team: teamId,
        user: userId,
        message
    });
};

const getTeamJoinRequests = async (teamId, leaderId) => {
    const team = await Team.findById(teamId);

    if (!team) {
        throw ApiError.notFound('Không tìm thấy nhóm');
    }

    if (team.leader.toString() !== leaderId.toString()) {
        throw ApiError.forbidden('Chỉ trưởng nhóm mới có thể xem yêu cầu tham gia');
    }

    return JoinRequest.find({ team: teamId })
        .populate('user', MEMBER_POPULATE_FIELDS)
        .sort({ createdAt: -1 })
        .lean();
};

const handleJoinRequest = async (teamId, requestId, leaderId, status) => {
    const joinRequest = await JoinRequest.findById(requestId);

    if (!joinRequest) {
        throw ApiError.notFound('Không tìm thấy yêu cầu tham gia');
    }

    if (joinRequest.team.toString() !== teamId.toString()) {
        throw ApiError.badRequest('Yêu cầu tham gia không thuộc nhóm này');
    }

    const team = await Team.findById(joinRequest.team);

    if (!team) {
        throw ApiError.notFound('Không tìm thấy nhóm');
    }

    if (team.leader.toString() !== leaderId.toString()) {
        throw ApiError.forbidden('Chỉ trưởng nhóm mới có thể xử lý yêu cầu tham gia');
    }

    if (joinRequest.status !== 'pending') {
        throw ApiError.conflict('Yêu cầu tham gia này đã được xử lý');
    }

    if (status === 'accepted' && team.members.length >= team.maxMembers) {
        throw ApiError.badRequest('Nhóm này đã đủ thành viên');
    }

    joinRequest.status = status;
    joinRequest.reviewedBy = leaderId;
    joinRequest.reviewedAt = new Date();
    await joinRequest.save();

    if (status === 'accepted') {
        team.members.addToSet(joinRequest.user);
        await team.save();
    }

    return joinRequest;
};

module.exports = {
    sendJoinRequest,
    getTeamJoinRequests,
    handleJoinRequest
};
