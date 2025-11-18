// frontend/src/pages/SuperAdmin.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#ec4899", "#a855f7"];

export default function SuperAdmin() {
    const { user, token } = useAuth();
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [activeTab, setActiveTab] = useState("users"); // 'users' | 'admins'
    const [stats, setStats] = useState({ users: 0, admins: 0, superAdmins: 0 });

    // Basic guard (ProtectedRoute should already handle it)
    useEffect(() => {
        if (!user || !token) return;
        if (user.role !== "superAdmin") {
            setError("Unauthorized — you must be a superAdmin to access this page.");
        }
    }, [user, token]);

    // Fetch users
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await api.get("/admin/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = res.data || [];
                setAllUsers(data);

                const counts = {
                    users: data.filter((u) => u.role === "user").length,
                    admins: data.filter((u) => u.role === "admin").length,
                    superAdmins: data.filter((u) => u.role === "superAdmin").length,
                };
                setStats(counts);
            } catch (err) {
                console.error("Failed to load users:", err);
                setError("Failed to load users. Check console for details.");
            } finally {
                setLoading(false);
            }
        };

        if (token && user?.role === "superAdmin") fetchAll();
    }, [token, user]);

    const showTempSuccess = (msg) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(""), 3500);
    };

    const showTempError = (msg) => {
        setError(msg);
        setTimeout(() => setError(""), 4000);
    };

    // Change role (promote/demote)
    const handleRoleChange = async (id, newRole) => {
        if (!window.confirm(`Change role to "${newRole}"?`)) return;
        try {
            await api.put(
                `/admin/users/${id}/role`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setAllUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));

            // Update counts quickly in UI
            setStats((prev) => {
                const copy = { ...prev };
                // recalc simple but safe
                const usersArr = allUsers.map((u) => (u.id === id ? { ...u, role: newRole } : u));
                copy.users = usersArr.filter((u) => u.role === "user").length;
                copy.admins = usersArr.filter((u) => u.role === "admin").length;
                copy.superAdmins = usersArr.filter((u) => u.role === "superAdmin").length;
                return copy;
            });

            showTempSuccess("Role updated successfully.");
        } catch (err) {
            console.error("Error updating role:", err);
            showTempError("Failed to update role.");
        }
    };

    // Delete user/admin
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this account? This action cannot be undone.")) return;
        try {
            await api.delete(`/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAllUsers((prev) => prev.filter((u) => u.id !== id));
            // Recalc stats
            setStats((prev) => {
                const usersArr = allUsers.filter((u) => u.id !== id);
                return {
                    users: usersArr.filter((u) => u.role === "user").length,
                    admins: usersArr.filter((u) => u.role === "admin").length,
                    superAdmins: usersArr.filter((u) => u.role === "superAdmin").length,
                };
            });
            showTempSuccess("Account deleted successfully.");
        } catch (err) {
            console.error("Error deleting user:", err);
            showTempError("Failed to delete account.");
        }
    };

    // Filtered lists
    const usersList = allUsers.filter((u) => u.role === "user");
    const adminsList = allUsers.filter((u) => u.role === "admin" || u.role === "superAdmin");

    const roleData = [
        { name: "Users", value: stats.users },
        { name: "Admins", value: stats.admins },
        { name: "SuperAdmins", value: stats.superAdmins },
    ];

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center text-green-600 font-semibold">
                Loading SuperAdmin dashboard...
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-pink-50 p-6">
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-6">
                <motion.h1
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-500 to-pink-500 bg-clip-text text-transparent"
                >
                    SuperAdmin Control Center
                </motion.h1>

                {/* Alerts */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-pink-100 text-pink-600 text-center rounded-md py-2 mb-4 font-medium"
                    >
                        {error}
                    </motion.div>
                )}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-100 text-green-600 text-center rounded-md py-2 mb-4 font-medium"
                    >
                        {success}
                    </motion.div>
                )}

                {/* Stats + Tabs */}
                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    {/* Stats cards */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1"
                    >
                        <div className="bg-green-100 p-4 rounded-xl shadow text-center">
                            <h3 className="text-green-700 font-semibold">Total Users</h3>
                            <p className="text-3xl font-bold text-green-600">{stats.users}</p>
                        </div>
                        <div className="bg-pink-100 p-4 rounded-xl shadow text-center">
                            <h3 className="text-pink-700 font-semibold">Admins</h3>
                            <p className="text-3xl font-bold text-pink-600">{stats.admins}</p>
                        </div>
                        <div className="bg-purple-100 p-4 rounded-xl shadow text-center">
                            <h3 className="text-purple-700 font-semibold">SuperAdmins</h3>
                            <p className="text-3xl font-bold text-purple-600">{stats.superAdmins}</p>
                        </div>
                    </motion.div>

                    {/* Tabs + Charts column */}
                    <div className="flex-1 bg-white rounded-xl shadow p-4 border">
                        {/* Tabs */}
                        <div className="flex items-center gap-3 mb-4">
                            <button
                                onClick={() => setActiveTab("users")}
                                className={`px-4 py-2 rounded-full font-medium transition ${activeTab === "users"
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                Users
                            </button>
                            <button
                                onClick={() => setActiveTab("admins")}
                                className={`px-4 py-2 rounded-full font-medium transition ${activeTab === "admins"
                                        ? "bg-pink-500 text-white"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                Admins
                            </button>
                        </div>

                        {/* Chart (small) */}
                        <h4 className="text-center font-semibold text-gray-700 mb-2">Role Distribution</h4>
                        <div style={{ width: "100%", height: 220 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={roleData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={70}
                                        label
                                    >
                                        {roleData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Management Table */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl shadow p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        {activeTab === "users" ? "Manage Users" : "Manage Admins"}
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-green-400 to-pink-400 text-white">
                                    <th className="p-3 text-left">Name</th>
                                    <th className="p-3 text-left">Email</th>
                                    <th className="p-3 text-left">Role</th>
                                    <th className="p-3 text-left">Joined</th>
                                    <th className="p-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(activeTab === "users" ? usersList : adminsList).map((u) => (
                                    <tr key={u.id} className="border-b hover:bg-green-50 transition">
                                        <td className="p-3 font-medium">
                                            {u.firstName} {u.lastName}
                                        </td>
                                        <td className="p-3 text-gray-700">{u.email}</td>
                                        <td className="p-3 text-gray-700 capitalize">{u.role}</td>
                                        <td className="p-3 text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3 text-center space-x-3">
                                            {/* Role selector for switching */}
                                            <select
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                value={u.role}
                                                className="border px-2 py-1 rounded-md text-sm mr-2"
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                                <option value="superAdmin">SuperAdmin</option>
                                            </select>

                                            {/* Delete (cannot delete current superAdmin account) */}
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-md text-sm transition"
                                                disabled={u.id === user?.id}
                                                title={u.id === user?.id ? "Can't delete the currently logged-in superAdmin" : "Delete account"}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {(activeTab === "users" ? usersList : adminsList).length === 0 && (
                        <p className="text-center text-gray-500 mt-6">No accounts found in this category.</p>
                    )}

                    {/* Big chart for larger screens */}
                    <div className="mt-8">
                        <h3 className="text-center font-semibold text-gray-700 mb-4">Users by Role (Bar)</h3>
                        <div style={{ width: "100%", height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={roleData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="value" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
