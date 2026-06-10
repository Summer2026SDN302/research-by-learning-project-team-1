import api from './api';

export const getMaterials = async (params = {}) => {
    const response = await api.get('/materials', { params });
    return response.data;
};

export const getMaterialById = async (id) => {
    const response = await api.get(`/materials/${id}`);
    return response.data.data.material;
};

export const createMaterial = async (payload) => {
    const response = await api.post('/materials', payload);
    return response.data.data.material;
};

export const updateMaterial = async (id, payload) => {
    const response = await api.put(`/materials/${id}`, payload);
    return response.data.data.material;
};

export const deleteMaterial = async (id) => {
    const response = await api.delete(`/materials/${id}`);
    return response.data;
};

export const downloadMaterial = async (id) => {
    const response = await api.post(`/materials/${id}/download`);
    return response.data.data.material;
};
