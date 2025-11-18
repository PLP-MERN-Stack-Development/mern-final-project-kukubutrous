import React, { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);

    const loadUsers = async () => {
        const res = await apiClient.get("/admin/users");
        setUsers(res.data.users);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const updateRole = async (id, role) => {
        await apiClient.put(`/admin/users/${id}/role`, { role });
        loadUsers();
    };

    const deleteUser = async (id) => {
        await apiClient.delete(`/admin/users/${id}`);
        loadUsers();
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
            <table className="w-full border-collapse border">
                <thead>
                    <tr>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Role</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td className="border p-2">{u.firstName} {u.lastName}</td>
                            <td className="border p-2">{u.email}</td>
                            <td className="border p-2">{u.role}</td>
                            <td className="border p-2 flex gap-2">
                                {u.role !== "superAdmin" && (
                                    <>
                                        <button
                                            className="px-2 py-1 bg-blue-500 text-white rounded"
                                            onClick={() => updateRole(u.id, u.role === "user" ? "admin" : "user")}
                                        >
                                            Toggle Role
                                        </button>
                                        <button
                                            className="px-2 py-1 bg-red-500 text-white rounded"
                                            onClick={() => deleteUser(u.id)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
