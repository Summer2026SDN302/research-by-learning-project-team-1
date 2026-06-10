import api from './api';

export const getCourses = async (params = {}) => {
    const response = await api.get('/courses', { params });
    return response.data;
};

export const getCourseById = async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data.data.course;
};

export const createCourse = async (payload) => {
    const response = await api.post('/courses', payload);
    return response.data.data.course;
};

export const updateCourse = async (id, payload) => {
    const response = await api.put(`/courses/${id}`, payload);
    return response.data.data.course;
};

export const deleteCourse = async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
};

export const addStudentToCourse = async (courseId, studentId) => {
    const response = await api.post(`/courses/${courseId}/students/${studentId}`);
    return response.data.data.course;
};

export const removeStudentFromCourse = async (courseId, studentId) => {
    const response = await api.delete(`/courses/${courseId}/students/${studentId}`);
    return response.data.data.course;
};
