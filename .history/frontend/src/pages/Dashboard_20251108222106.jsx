import React, { useEffect, useState, useContext } from "react";
import axios from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import UserCard from "../components/UserCard";

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ users: 0, chats: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user.role === "admin" || user.role === "superAdmin") {
                    // Fetch admin dashboard stats
                    const res = await axios.get("/admin/stats");
                    setStats(res.data);
                } else {
                    // Fetch other users for roommate browsing
                    const res = await axios.get("/users");
                    setUsers(res.data.users);
                }
                setLoading(false);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setLoading(false);
            }
        };
        fetchData();
    }, [user.role]);

    if (loading) return <div className="p-6 text-center">Loading...</div>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">
                {user.role === "admin" || user.role === "superAdmin"
                    ? "Admin Dashboard"
                    : "Explore Roommates"}
            </h1>

            {user.role === "admin" || user.role === "superAdmin" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded shadow bg-white">
                        <div className="text-gray-600">Total Users</div>
                        <div className="text-2xl font-bold">{stats.users}</div>
                    </div>
                    <div className="p-4 border rounded shadow bg-white">
                        <div className="text-gray-600">Total Chats</div>
                        <div className="text-2xl font-bold">{stats.chats}</div>
                    </div>
                    <div className="p-4 border rounded shadow bg-white">
                        <div className="text-gray-600">Other Stats</div>
                        <div className="text-2xl font-bold">—</div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {users.length === 0 && (
                        <div className="col-span-full text-center text-gray-500">
                            No users found
                        </div>
                    )}
                    {users.map((u) => (
                        <UserCard key={u.id} user={u} />
                    ))}
                </div>
            )}
        </div>
    );
}
