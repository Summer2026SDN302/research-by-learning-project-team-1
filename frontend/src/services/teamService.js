import api from './api';

export const getTeams = async (params = {}) => {
    const response = await api.get('/teams', { params });
    return response.data;
};

export const getRecommendedTeams = async (params = {}) => {
    const response = await api.get('/teams/recommended', { params });
    return response.data;
};

export const getRecommendedTeammates = async (params = {}) => {
    const response = await api.get('/teams/recommended-teammates', { params });
    return response.data;
};

export const createTeam = async (payload) => {
    const response = await api.post('/teams', payload);
    return response.data.data.team;
};

export const sendJoinRequest = async (teamId, message) => {
    const response = await api.post(`/teams/${teamId}/join-requests`, { message });
    return response.data.data.joinRequest;
};

export const getMyTeams = async () => {
    const response = await api.get('/teams/my-teams');
    return response.data.data.teams;
};
