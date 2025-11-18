//frontend/src/pages/Admin.jsx
import React, { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import {
    FaUsers,
    FaChartPie,
    FaTrash,
    FaEdit,
    FaArrowUp,
    FaArrowDown
} from "react-icons/fa";

export default function Admin() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ users: 0, chats: 0, messages: 0 });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await api.get("/admin/stats");
                setStats(statsRes.data);

                const usersRes = await api.get("/admin/users");
                setUsers(usersRes.data.users);
            } catch (err) {
                console.error("Failed to fetch admin data:", err);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (err) {
            console.error("Delete user failed:", err);
        }
    };

    const handleRoleChange = async (id, role) => {
        try {
            await api.put(`/admin/users/${id}/role`, { role });

            // Update UI immediately
            setUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, role } : u))
            );
        } catch (err) {
            console.error("Role update failed:", err);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                {user.role === "superAdmin" ? "Super Admin Dashboard" : "Admin Dashboard"}
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-green-100 rounded-xl shadow flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold">Users</h2>
                        <p className="text-3xl font-bold">{stats.users}</p>
                    </div>
                    <FaUsers className="text-green-600 text-2xl" />
                </div>

                <div className="p-4 bg-blue-100 rounded-xl shadow flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold">Chats</h2>
                        <p className="text-3xl font-bold">{stats.chats}</p>
                    </div>
                    <FaChartPie className="text-blue-600 text-2xl" />
                </div>

                <div className="p-4 bg-pink-500 rounded-xl shadow flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold">Messages</h2>
                        <p className="text-3xl font-bold">{stats.messages}</p>
                    </div>
                </div>
            </div>

            {/* User Management */}
            <div className="bg-white p-4 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4">User Management</h2>

                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2">Name</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Role</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-t">
                                <td className="p-2">{u.firstName} {u.lastName}</td>
                                <td className="p-2">{u.email}</td>
                                <td className="p-2">{u.role}</td>

                                <td className="p-2 space-x-2 flex items-center">
                                    <button
                                        onClick={() => handleDelete(u.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    >
                                        <FaTrash />
                                    </button>

                                    {user.role === "superAdmin" && (
                                        <>
                                            <button
                                                onClick={() => handleRoleChange(u.id, "admin")}
                                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                            >
                                                <FaArrowUp />
                                            </button>

                                            <button
                                                onClick={() => handleRoleChange(u.id, "user")}
                                                className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                                            >
                                                <FaArrowDown />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    );
}


