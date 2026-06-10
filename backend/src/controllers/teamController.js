const teamService = require('../services/teamService');
const matchingService = require('../services/matchingService');
const joinRequestService = require('../services/joinRequestService');
const ApiResponse = require('../utils/apiResponse');

const createTeam = async (req, res, next) => {
    try {
        const team = await teamService.createTeam(req.user.id, req.body);

        return ApiResponse.success(res, { team }, 'Tạo nhóm thành công', 201);
    } catch (error) {
        next(error);
    }
};

const getTeams = async (req, res, next) => {
    try {
        const { page, limit, status, search, skills, tags } = req.query;
        const result = await teamService.getTeams({
            page,
            limit,
            status,
            search,
            skills: skills ? skills.split(',') : undefined,
            tags: tags ? tags.split(',') : undefined,
        });

        return ApiResponse.paginated(
            res,
            result.teams,
            result.pagination.page,
            result.pagination.limit,
            result.pagination.total,
            'Lấy danh sách nhóm thành công'
        );
    } catch (error) {
        next(error);
    }
};

const getTeamById = async (req, res, next) => {
    try {
        const team = await teamService.getTeamById(req.params.id);

        return ApiResponse.success(res, { team }, 'Lấy thông tin nhóm thành công');
    } catch (error) {
        next(error);
    }
};

const updateTeam = async (req, res, next) => {
    try {
        const team = await teamService.updateTeam(
            req.params.id,
            req.user.id,
            req.body
        );

        return ApiResponse.success(res, { team }, 'Cập nhật nhóm thành công');
    } catch (error) {
        next(error);
    }
};

const deleteTeam = async (req, res, next) => {
    try {
        await teamService.deleteTeam(req.params.id, req.user.id);

        return ApiResponse.success(res, null, 'Xóa nhóm thành công');
    } catch (error) {
        next(error);
    }
};

const getMyTeams = async (req, res, next) => {
    try {
        const teams = await teamService.getMyTeams(req.user.id);

        return ApiResponse.success(res, { teams }, 'Lấy nhóm của bạn thành công');
    } catch (error) {
        next(error);
    }
};

const removeMember = async (req, res, next) => {
    try {
        const team = await teamService.removeMember(
            req.params.id,
            req.user.id,
            req.params.memberId
        );

        return ApiResponse.success(res, { team }, 'Xóa thành viên khỏi nhóm thành công');
    } catch (error) {
        next(error);
    }
};

const leaveTeam = async (req, res, next) => {
    try {
        const team = await teamService.leaveTeam(req.params.id, req.user.id);

        return ApiResponse.success(res, { team }, 'Rời nhóm thành công');
    } catch (error) {
        next(error);
    }
};

const getRecommendedTeams = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const result = await matchingService.getRecommendedTeams(
            req.user.id,
            { page, limit }
        );

        return ApiResponse.paginated(
            res,
            result.teams,
            result.pagination.page,
            result.pagination.limit,
            result.pagination.total,
            'Lấy nhóm phù hợp thành công'
        );
    } catch (error) {
        next(error);
    }
};

const getRecommendedTeammates = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const result = await matchingService.getRecommendedTeammates(
            req.user.id,
            { page, limit }
        );

        return ApiResponse.paginated(
            res,
            result.students,
            result.pagination.page,
            result.pagination.limit,
            result.pagination.total,
            'Lấy gợi ý đồng đội thành công'
        );
    } catch (error) {
        next(error);
    }
};

const getCompatibilityScore = async (req, res, next) => {
    try {
        const score = await matchingService.getCompatibilityScore(
            req.user.id,
            req.params.targetId
        );

        return ApiResponse.success(
            res,
            { score },
            'Tính điểm phù hợp thành công'
        );
    } catch (error) {
        next(error);
    }
};

const sendJoinRequest = async (req, res, next) => {
    try {
        const { message } = req.body;
        const joinRequest = await joinRequestService.sendJoinRequest(
            req.params.id,
            req.user.id,
            message ?? ''
        );

        return ApiResponse.success(
            res,
            { joinRequest },
            'Gửi yêu cầu tham gia thành công',
            201
        );
    } catch (error) {
        next(error);
    }
};

const getTeamJoinRequests = async (req, res, next) => {
    try {
        const joinRequests = await joinRequestService.getTeamJoinRequests(
            req.params.id,
            req.user.id
        );

        return ApiResponse.success(
            res,
            { joinRequests },
            'Lấy danh sách yêu cầu tham gia thành công'
        );
    } catch (error) {
        next(error);
    }
};

const handleJoinRequest = async (req, res, next) => {
    try {
        const { status } = req.body;
        const joinRequest = await joinRequestService.handleJoinRequest(
            req.params.id,
            req.params.requestId,
            req.user.id,
            status
        );

        return ApiResponse.success(
            res,
            { joinRequest },
            status === 'accepted' ? 'Đã chấp nhận yêu cầu tham gia' : 'Đã từ chối yêu cầu tham gia'
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTeam,
    getTeams,
    getTeamById,
    updateTeam,
    deleteTeam,
    getMyTeams,
    removeMember,
    leaveTeam,
    getRecommendedTeams,
    getRecommendedTeammates,
    getCompatibilityScore,
    sendJoinRequest,
    getTeamJoinRequests,
    handleJoinRequest,
};
