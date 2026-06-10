import api from './api';

export const getPosts = async (params = {}) => {
    const response = await api.get('/posts', { params });
    return response.data;
};

export const getPostById = async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data.data.post;
};

export const createPost = async (payload) => {
    const response = await api.post('/posts', payload);
    return response.data.data.post;
};

export const updatePost = async (id, payload) => {
    const response = await api.put(`/posts/${id}`, payload);
    return response.data.data.post;
};

export const deletePost = async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
};

export const toggleReaction = async (postId, type) => {
    const response = await api.post(`/posts/${postId}/reactions`, { type });
    return response.data.data;
};

export const getUserReactions = async (postId) => {
    const response = await api.get(`/posts/${postId}/reactions`);
    return response.data.data.reactions;
};

export const moderatePost = async (id, status) => {
    const response = await api.patch(`/posts/${id}/moderate`, { status });
    return response.data.data.post;
};
