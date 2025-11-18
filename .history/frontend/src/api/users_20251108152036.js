import { apiClient } from "./apiClient";

export const updateProfile = async (data) => {
    const res = await apiClient.put("/users/me", data);
    return res.data.user;
};

export const searchUsers = async (query) => {
    const res = await apiClient.get("/users", { params: query });
    return res.data.users;
};

//chat with others
export con