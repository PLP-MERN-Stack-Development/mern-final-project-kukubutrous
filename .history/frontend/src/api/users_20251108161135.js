import { apiClient } from "./apiClient";

import apiClient from './apiClient';

export const getMe = () => apiClient.get('/users/me');
export const updateMe = (data) => apiClient.put('/users/me', data);
export const searchUsers = (params) => apiClient.get('/users', { params });



export const updateProfile = async (data) => {
    const res = await apiClient.put("/users/me", data);
    return res.data.user;
};

export const searchUsers = async (query) => {
    const res = await apiClient.get("/users", { params: query });
    return res.data.users;
};

