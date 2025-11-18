import apiClient from './apiClient';

export const login = (data) => apiClient.post('/auth/login', data);
export const register = (data) => apiClient.post('/auth/register', data);
export const verifyEmail = (token) => apiClient.get(`/auth/verify?token=${token}`);
export const requestReset = (email) => apiClient.post('/auth/request-password-reset', { email });
export const resetPassword = (token, password) => apiClient.post('/auth/reset-password', { token, password });
