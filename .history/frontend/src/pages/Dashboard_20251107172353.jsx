// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { Link } from "react-router-dom";

/**
 * Simple admin dashboard showing:
 * - users count
 * - chats count
 * - recent users
 * - recent chats
 *
 * Uses existing backend endpoints:
 * GET /admin/users  -> { users: [...] }
 * GET /chats        -> { chats: [...] }
 */
export default function Dashboard() {
    const [users, setUsers] = useState([]);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            setErr("");
            try {
                const [uRes, cRes] = await Promise.all([API.get("/admin/users"), API.get("/chats")]);
                if (!mounted) return;
                setUsers(uRes.data.users || []);
                setChats(cRes.data.chats || []);
            } catch (e) {
                console.error("Dashboard load error", e);
                setErr(e?.response?.data?.message || "Could not load dashboard data");
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            {loading ? (
                <div className="p-6 bg-white rounded shadow">Loading dashboard...</div>
            ) : err ? (
                <div className="p-4 bg-rose-100 text-rose-700 rounded">{err}</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="stat-card">
                            <div className="stat-title">Users</div>
                            <div className="stat-value">{users.length}</div>
                            <div className="stat-sub">Total registered users</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-title">Chats</div>
                            <div className="stat-value">{chats.length}</div>
                            <div className="stat-sub">Active conversations</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-title">Recent Activity</div>
                            <div className="stat-value">{Math.max(0, (chats.filter(c => (Date.now() - new Date(c.updatedAt || Date.now())) < 1000 * 60 * 60 * 24).length))}</div>
                            <div className="stat-sub">Chats in last 24h</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <section className="panel">
                            <div className="panel-header">
                                <h3 className="text-lg font-semibold">Latest Users</h3>
                                <Link to="/admin" className="text-sm text-sky-600">Manage</Link>
                            </div>

                            <ul className="divide-y">
                                {users.slice(0, 8).map(u => (
                                    <li key={u.id} className="py-3 flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">{u.firstName} {u.lastName}</div>
                                            <div className="text-sm text-slate-500">{u.email} • {u.location || "No location"}</div>
                                        </div>
                                        <div className="text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</div>
                                    </li>
                                ))}
                                {users.length === 0 && <li className="p-4 text-sm text-slate-500">No users yet</li>}
                            </ul>
                        </section>

                        <section className="panel">
                            <div className="panel-header">
                                <h3 className="text-lg font-semibold">Recent Chats</h3>
                                <Link to="/inbox" className="text-sm text-sky-600">Open Inbox</Link>
                            </div>

                            <ul className="divide-y">
                                {chats.slice(0, 8).map(c => {
                                    const other = c.user1 ? (c.user1.id === c.user?.id ? c.user2 : c.user1) : null;
                                    const title = other ? `${other.firstName} ${other.lastName}` : `Chat ${c.id}`;
                                    return (
                                        <li key={c.id} className="py-3 flex items-center justify-between">
                                            <div>
                                                <div className="font-medium">{title}</div>
                                                <div className="text-sm text-slate-500">{c.latestMessage?.text?.slice(0, 80) || "No messages yet"}</div>
                                            </div>
                                            <div className="text-xs text-slate-400">{c.latestMessage ? new Date(c.latestMessage.createdAt).toLocaleString() : ""}</div>
                                        </li>
                                    );
                                })}
                                {chats.length === 0 && <li className="p-4 text-sm text-slate-500">No chats yet</li>}
                            </ul>
                        </section>
                    </div>
                </>
            )}
        </div>
    );
}
