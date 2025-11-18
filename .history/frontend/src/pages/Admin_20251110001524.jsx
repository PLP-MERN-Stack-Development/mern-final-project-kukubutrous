//frontend/src/pages/

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
