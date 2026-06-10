import api from './api';

export const getEvents = async (params = {}) => {
    const response = await api.get('/events', { params });
    return response.data;
};

export const getEventById = async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data.data.event;
};

export const createEvent = async (payload) => {
    const response = await api.post('/events', payload);
    return response.data.data.event;
};

export const updateEvent = async (id, payload) => {
    const response = await api.put(`/events/${id}`, payload);
    return response.data.data.event;
};

export const deleteEvent = async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
};

export const registerForEvent = async (eventId) => {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data.data.participant;
};

export const cancelRegistration = async (eventId) => {
    const response = await api.post(`/events/${eventId}/cancel`);
    return response.data.data.participant;
};

export const checkInEvent = async (eventId) => {
    const response = await api.post(`/events/${eventId}/check-in`);
    return response.data.data.participant;
};

export const getMyEvents = async () => {
    const response = await api.get('/events/my-events');
    return response.data.data.events;
};
