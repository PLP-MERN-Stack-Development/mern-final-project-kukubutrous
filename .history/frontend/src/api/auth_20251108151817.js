import { apiClient } from "./apiClient";

export const loginUser = async (email, password) => {
    const res = await apiClient.post("/auth/login", { email, password });
    return res.data;
};

export const registerUser = async (form) => {
    const res = await apiClient.post("/auth/register", form);
    return res.data;
};

export const getProfile = async (token) => {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const res = await apiClient.get("/users/me");
    return res.data.user;
};
