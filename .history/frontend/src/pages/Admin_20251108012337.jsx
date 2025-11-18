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

export default function Admin() {
    const { user, token } = useAuth();
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [stats, setStats] = useState({ users: 0, admins: 0, superAdmins: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [activeTab, setActiveTab] = useState("users"); // Users / Admins

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/admin/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = res.data;

                setUsers(data.filter((u) => u.role === "user"));
                setAdmins(data.filter((u) => u.role === "admin"));

                // Stats counting
                setStats({
                    users: data.filter((u) => u.role === "user").length,
                    admins: data.filter((u) => u.role === "admin").length,
                    superAdmins: data.filter((u) => u.role === "superAdmin").length,
                });
            } catch (err) {
                console.error(err);
                setError("Failed to load users/admins");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const handleRoleChange = async (id, newRole) => {
        try {
            await api.put(
                `/admin/users/${id}/role`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update lists dynamically
            setUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
            );
            setAdmins((prev) =>
                prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
            );

            setSuccess("Role updated successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            console.error(err);
            setError("Failed to update role");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this account?")) return;
        try {
            await api.delete(`/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers((prev) => prev.filter((u) => u.id !== id));
            setAdmins((prev) => prev.filter((u) => u.id !== id));
            setSuccess("Account deleted successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            console.error(err);
            setError("Failed to delete account");
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center text-green-600 font-semibold">
                Loading Admin Dashboard...
            </div>
        );

    const roleData = [
        { name: "Users", value: stats.users },
        { name: "Admins", value: stats.admins },
        { name: "SuperAdmins", value: stats.superAdmins },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-pink-50 p-6">
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-6">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-500 to-pink-500 bg-clip-text text-transparent"
                >
                    {user?.role === "superAdmin"
                        ? "SuperAdmin Dashboard"
                        : "Admin Dashboard"}
                </motion.h1>

                {/* Alerts */}
                {error && (
                    <div className="bg-pink-100 text-pink-600 text-center rounded-md py-2 mb-4 font-medium">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 text-green-600 text-center rounded-md py-2 mb-4 font-medium">
                        {success}
                    </div>
                )}

                {/* Tabs */}
                {user?.role === "superAdmin" && (
                    <div className="flex gap-4 mb-6 justify-center">
                        {["users", "admins"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-full font-medium transition ${
                                    activeTab === tab
                                        ? "bg-gradient-to-r from-green-500 to-pink-500 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {tab === "users" ? "Users" : "Admins"}
                            </button>
                        ))}
                    </div>
                )}

                {/* Charts Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <div className="bg-white rounded-xl shadow p-4 border">
                        <h3 className="text-center font-semibold text-gray-700 mb-2">
                            Role Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={roleData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
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
                    <div className="bg-white rounded-xl shadow p-4 border">
                        <h3 className="text-center font-semibold text-gray-700 mb-2">
                            Users by Role
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={roleData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#22c55e" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Management Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-green-400 to-pink-400 text-white">
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Role</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(activeTab === "users" ? users : admins).map((u) => (
                                <tr key={u.id} className="border-b hover:bg-green-50 transition">
                                    <td className="p-3 font-medium">
                                        {u.firstName} {u.lastName}
                                    </td>
                                    <td className="p-3 text-gray-700">{u.email}</td>
                                    <td className="p-3 text-gray-700 capitalize">{u.role}</td>
                                    <td className="p-3 text-center space-x-3">
                                        {user?.role === "superAdmin" && (
                                            <select
                                                onChange={(e) =>
                                                    handleRoleChange(u.id, e.target.value)
                                                }
                                                value={u.role}
                                                className="border px-2 py-1 rounded-md text-sm"
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                                <option value="superAdmin">SuperAdmin</option>
                                            </select>
                                        )}
                                        <button
                                            onClick={() => handleDelete(u.id)}
                                            className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-md text-sm transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {(activeTab === "users" ? users : admins).length === 0 && (
                    <p className="text-center text-gray-500 mt-6">
                        No {activeTab} found.
                    </p>
                )}
            </div>
        </div>
    );
}
