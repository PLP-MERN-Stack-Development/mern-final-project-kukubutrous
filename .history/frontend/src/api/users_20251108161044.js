import apiClient from './apiClient';

export const getMe = () => apiClient.get('/users/me');
export const updateMe = (data) => apiClient.put('/users/me', data);
export const searchUsers = (params) => apiClient.get('/users', { params });
