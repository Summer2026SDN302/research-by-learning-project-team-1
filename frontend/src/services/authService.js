import api from './api';

export const login = async (payload) => {
    const response = await api.post('/auth/login', payload);
    return response.data.data;
};

export const register = async (payload) => {
    const response = await api.post('/auth/register', payload);
    return response.data.data;
};

export const logout = async () => {
    const response = await api.post('/auth/logout');
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get('/users/profile');
    return response.data.data.user;
};
