import api from './api';

export const getWorkspaceOverview = async (teamId) => {
    const response = await api.get(`/workspace/${teamId}/overview`);
    return response.data.data;
};

export const getTasks = async (teamId, params = {}) => {
    const response = await api.get(`/workspace/${teamId}/tasks`, { params });
    return response.data.data.tasks;
};

export const createTask = async (teamId, payload) => {
    const response = await api.post(`/workspace/${teamId}/tasks`, payload);
    return response.data.data.task;
};

export const updateTask = async (teamId, taskId, payload) => {
    const response = await api.put(`/workspace/${teamId}/tasks/${taskId}`, payload);
    return response.data.data.task;
};

export const deleteTask = async (teamId, taskId) => {
    const response = await api.delete(`/workspace/${teamId}/tasks/${taskId}`);
    return response.data;
};

export const getDocuments = async (teamId, params = {}) => {
    const response = await api.get(`/workspace/${teamId}/documents`, { params });
    return response.data.data.documents;
};

export const uploadDocument = async (teamId, payload) => {
    const response = await api.post(`/workspace/${teamId}/documents`, payload);
    return response.data.data.document;
};

export const updateDocument = async (teamId, docId, payload) => {
    const response = await api.put(`/workspace/${teamId}/documents/${docId}`, payload);
    return response.data.data.document;
};

export const deleteDocument = async (teamId, docId) => {
    const response = await api.delete(`/workspace/${teamId}/documents/${docId}`);
    return response.data;
};

export const getLinks = async (teamId, params = {}) => {
    const response = await api.get(`/workspace/${teamId}/links`, { params });
    return response.data.data.links;
};

export const createLink = async (teamId, payload) => {
    const response = await api.post(`/workspace/${teamId}/links`, payload);
    return response.data.data.link;
};

export const updateLink = async (teamId, linkId, payload) => {
    const response = await api.put(`/workspace/${teamId}/links/${linkId}`, payload);
    return response.data.data.link;
};

export const deleteLink = async (teamId, linkId) => {
    const response = await api.delete(`/workspace/${teamId}/links/${linkId}`);
    return response.data;
};

export const getMessages = async (teamId, params = {}) => {
    const response = await api.get(`/workspace/${teamId}/messages`, { params });
    return response.data;
};

export const sendMessage = async (teamId, content, attachments) => {
    const response = await api.post(`/workspace/${teamId}/messages`, { content, attachments });
    return response.data.data.message;
};

export const editMessage = async (teamId, messageId, content) => {
    const response = await api.put(`/workspace/${teamId}/messages/${messageId}`, { content });
    return response.data.data.message;
};

export const pinMessage = async (teamId, messageId) => {
    const response = await api.patch(`/workspace/${teamId}/messages/${messageId}/pin`);
    return response.data.data.message;
};

export const deleteMessage = async (teamId, messageId) => {
    const response = await api.delete(`/workspace/${teamId}/messages/${messageId}`);
    return response.data;
};
