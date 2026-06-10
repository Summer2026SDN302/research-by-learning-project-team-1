import api from './api';

export const updateProfile = async (payload) => {
    const response = await api.put('/users/profile', payload);
    return response.data.data.user;
};

export const updateGpa = async (gpa) => {
    const response = await api.put('/users/gpa', { gpa });
    return response.data.data.user;
};

export const updateSkills = async (skills) => {
    const response = await api.put('/users/skills', { skills });
    return response.data.data.user;
};

export const updateInterests = async (interests) => {
    const response = await api.put('/users/interests', { interests });
    return response.data.data.user;
};

export const getStudents = async (params = {}) => {
    const response = await api.get('/users/students', { params });
    return response.data;
};
