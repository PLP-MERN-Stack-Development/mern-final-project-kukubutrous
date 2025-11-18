import React, { useEffect, useState } from "react";
import api from "../utils/api.js";
import { useSocket } from "../hooks/useSocket.jsx";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export function AdminDashboard() {
    const [stats, setStats] = useState({ totalUsers: 0, verifiedUsers: 0, totalChats: 0, totalMessages: 0 });
    const [users, setUsers] = useState([]);
    const socketRef = useSocket();

    useEffect(() => {
        async function load() {
            try {
                const s = await api.get("/admin/dashboard/stats");
                setStats(s.data);

                const u = await api.get("/admin/users");
                setUsers(u.data.users);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load dashboard data.");
            }
        }
        load();
    }, []);

    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        const onUpdate = (update) => {
            if (update.action === "deleted") {
                setUsers((prev) => prev.filter((x) => x.id !== update.user.id));
                toast.error(`User ${update.user.email} deleted`);
            }
            if (update.action === "role_changed") {
                setUsers((prev) => prev.map((x) => (x.id === update.user.id ? { ...x, role: update.user.role } : x)));
                toast.success(`Role updated for ${update.user.email}`);
            }
            if (update.action === "created") {
                setUsers((prev) => [update.user, ...prev]);
                toast.success(`New user created: ${update.user.email}`);
            }
        };

        socket.on("admin_user_update", onUpdate);
        return () => socket.off("admin_user_update", onUpdate);
    }, [socketRef]);

    const handleDelete = async (id) => {
        if (!confirm("Delete this user?")) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers((prev) => prev.filter((u) => u.id !== id));
            toast.success("User deleted successfully");
        } catch {
            toast.error("Failed to delete user");
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 p-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <AnimatedCard title="Users" value={stats.totalUsers} />
                <AnimatedCard title="Verified" value={stats.verifiedUsers} />
                <AnimatedCard title="Chats" value={stats.totalChats} />
                <AnimatedCard title="Messages" value={stats.totalMessages} />
            </section>

            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white rounded shadow p-4">
                <h2 className="text-lg font-medium mb-4">Latest Users</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100">
                                <th className="p-2">#</th>
                                <th className="p-2">Name</th>
                                <th className="p-2">Email</th>
                                <th className="p-2">Role</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, i) => (
                                <motion.tr key={u.id} className="border-t hover:bg-slate-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <td className="p-2">{i + 1}</td>
                                    <td className="p-2">{u.firstName} {u.lastName}</td>
                                    <td className="p-2">{u.email}</td>
                                    <td className="p-2 capitalize">{u.role}</td>
                                    <td className="p-2">
                                        <button onClick={() => handleDelete(u.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">Delete</button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.section>
        </motion.div>
    );
}

function AnimatedCard({ title, value }) {
    return (
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-lg p-4 shadow cursor-pointer transition">
            <span className="text-sm text-slate-500">{title}</span>
            <span className="text-2xl font-bold block mt-1">{value}</span>
        </motion.div>
    );
}
