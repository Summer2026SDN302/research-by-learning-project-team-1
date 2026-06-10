import api from './api';

export const getQuizzes = async (params = {}) => {
    const response = await api.get('/quizzes', { params });
    return response.data;
};

export const getQuizById = async (id) => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data.data.quiz;
};

export const createQuiz = async (payload) => {
    const response = await api.post('/quizzes', payload);
    return response.data.data.quiz;
};

export const updateQuiz = async (id, payload) => {
    const response = await api.put(`/quizzes/${id}`, payload);
    return response.data.data.quiz;
};

export const deleteQuiz = async (id) => {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
};

export const submitQuiz = async (quizId, answers) => {
    const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
    return response.data.data.attempt;
};

export const getQuizAttempts = async (quizId) => {
    const response = await api.get(`/quizzes/${quizId}/attempts`);
    return response.data.data.attempts;
};

export const getAttemptDetail = async (attemptId) => {
    const response = await api.get(`/quizzes/attempts/${attemptId}`);
    return response.data.data.attempt;
};

export const getMyAttempts = async (params = {}) => {
    const response = await api.get('/quizzes/my-attempts', { params });
    return response.data;
};
