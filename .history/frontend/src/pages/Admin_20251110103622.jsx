import React, { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { FaUsers, FaChartPie, FaTrash, FaEdit, FaArrowUp, FaArrowDown } from "react-icons/fa";

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

    // Delete User
    const handleDelete = async (id) => {
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter((u) => u.id !== id));
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    // Promote user to admin
    const handlePromote = async (id) => {
        try {
            await api.put(`/admin/users/${id}/role`, { role: "admin" });
            setUsers(users.map((u) => (u.id === id ? { ...u, role: "admin" } : u)));
        } catch (err) {
            console.error("Promote failed", err);
        }
    };

    // Demote user to normal user
    const handleDemote = async (id) => {
        try {
            await api.put(`/admin/users/${id}/role`, { role: "user" });
            setUsers(users.map((u) => (u.id === id ? { ...u, role: "user" } : u)));
        } catch (err) {
            console.error("Demote failed", err);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                {user.role === "superAdmin" ? "Super Admin Dashboard" : "Admin Dashboard"}
            </h1>

            {/* --------- Stats Cards --------- */}
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

                <div className="p-4 bg-pink-100 rounded-xl shadow flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold">Messages</h2>
                        <p className="text-3xl font-bold">{stats.messages}</p>
                    </div>
                </div>
            </div>

            {/* --------- User Management Table --------- */}
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

                                <td className="p-2 space-x-2">
                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDelete(u.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    >
                                        <FaTrash />
                                    </button>

                                    {/* Edit Placeholder */}
                                    <button
                                        onClick={() => console.log("Edit user", u.id)}
                                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                    >
                                        <FaEdit />
                                    </button>

                                    {/* Promote/Demote only if superAdmin */}
                                    {user.role === "superAdmin" && (
                                        <>
                                            <button
                                                onClick={() => handlePromote(u.id)}
                                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                            >
                                                <FaArrowUp />
                                            </button>

                                            <button
                                                onClick={() => handleDemote(u.id)}
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

*/



/*
//frontend/src/pages/Admin.jsx

import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function Admin() {
    const [stats, setStats] = useState({ users: 0, chats: 0, messages: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/admin/stats");
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-green-100 rounded shadow">
                    <h2 className="text-lg font-semibold">Users</h2>
                    <p className="text-3xl">{stats.users}</p>
                </div>
                <div className="p-4 bg-blue-100 rounded shadow">
                    <h2 className="text-lg font-semibold">Chats</h2>
                    <p className="text-3xl">{stats.chats}</p>
                </div>
                <div className="p-4 bg-pink-100 rounded shadow">
                    <h2 className="text-lg font-semibold">Messages</h2>
                    <p className="text-3xl">{stats.messages}</p>
                </div>
            </div>
        </div>
    );
}

*/