import api from './api';

export const getNotifications = async (params = {}) => {
    const response = await api.get('/notifications', { params });
    return response.data;
};

export const markAsRead = async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data.data.notification;
};

export const markAllAsRead = async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data.data;
};

export const deleteNotification = async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
};

export const deleteAllRead = async () => {
    const response = await api.delete('/notifications/read-all');
    return response.data.data;
};
