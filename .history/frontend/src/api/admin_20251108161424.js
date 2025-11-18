import apiClient from "./apiClient";

/**
 * Fetch all users (admin/superAdmin)
 */
export const fetchUsers = async () => {
    try {
        const res = await apiClient.get("/admin/users");
        return res.data.users;
    } catch (err) {
        console.error("Error fetching users:", err.response?.data || err.message);
        throw err;
    }
};

/**
 * Update a user's role (superAdmin only)
 * @param {number} userId
 * @param {string} role - 'user', 'admin', or 'superAdmin'
 */
export const updateUserRole = async (userId, role) => {
    try {
        const res = await apiClient.put(`/admin/users/${userId}/role`, { role });
        return res.data.user;
    } catch (err) {
        console.error("Error updating user role:", err.response?.data || err.message);
        throw err;
    }
};

/**
 * Delete a user (admin or superAdmin)
 * @param {number} userId
 */
export const deleteUser = async (userId) => {
    try {
        const res = await apiClient.delete(`/admin/users/${userId}`);
        return res.data.message;
    } catch (err) {
        console.error("Error deleting user:", err.response?.data || err.message);
        throw err;
    }
};
