import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import UserCard from "../components/UserCard";
import ChatWindow from "../components/ChatWindow";
import api from "../utils/api";
import { connectSocket } from "../utils/socket";

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const { openChats, openChat, closeChat, toggleMinimize } = useContext(ChatContext);

    const [stats, setStats] = useState({
        totalUsers: 0,
        verifiedUsers: 0,
        totalChats: 0,
        totalMessages: 0,
    });

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState({
        location: "",
        roomType: "",
        budgetMin: "",
        budgetMax: "",
        hobby: "",
        gender: "",
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            if (user.role === "admin" || user.role === "superAdmin") {
                const res = await api.get("/admin/dashboard/stats");
                setStats(res.data);

                const usersRes = await api.get("/admin/users");
                setUsers(usersRes.data.users);
            } else {
                const res = await api.get("/users", { params: search });
                const filtered = res.data.users.filter(
                    (u) => u.role === "user" && u.id !== user.id
                );
                setUsers(filtered);
            }
        } catch (err) {
            console.error("Dashboard fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Socket.io integration
    useEffect(() => {
        fetchData();

        if (user.role === "admin" || user.role === "superAdmin") {
            const socket = connectSocket();

            socket.on("admin_user_update", (data) => {
                console.log("Admin update received:", data);

                // Update stats
                fetchData();

                // Real-time updates for user list
                if (data.action === "deleted") {
                    setUsers((prev) => prev.filter((u) => u.id !== data.user.id));
                } else if (data.action === "role_changed") {
                    setUsers((prev) =>
                        prev.map((u) =>
                            u.id === data.user.id ? { ...u, role: data.user.role } : u
                        )
                    );
                } else if (data.action === "created") {
                    setUsers((prev) => [data.user, ...prev]);
                }
            });

            return () => {
                socket.off("admin_user_update");
            };
        }
    }, [user.role]);

    const handleSearchChange = (e) =>
        setSearch({ ...search, [e.target.name]: e.target.value });

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        await fetchData();
    };

    if (loading) return <div className="p-6 text-center">Loading...</div>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">
                {user.role === "admin" || user.role === "superAdmin"
                    ? "Admin Dashboard"
                    : "Browse Roommates"}
            </h1>

            {user.role === "admin" || user.role === "superAdmin" ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <StatCard title="Total Users" value={stats.totalUsers} />
                        <StatCard title="Verified Users" value={stats.verifiedUsers} />
                        <StatCard title="Total Chats" value={stats.totalChats} />
                        <StatCard title="Total Messages" value={stats.totalMessages} />
                    </div>

                    <UserManagement users={users} openChat={openChat} userRole={user.role} />
                </>
            ) : (
                <>
                    {/* Search Form */}
                    <form
                        className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6"
                        onSubmit={handleSearchSubmit}
                    >
                        <input
                            type="text"
                            placeholder="Location"
                            name="location"
                            value={search.location}
                            onChange={handleSearchChange}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Room Type"
                            name="roomType"
                            value={search.roomType}
                            onChange={handleSearchChange}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Hobby"
                            name="hobby"
                            value={search.hobby}
                            onChange={handleSearchChange}
                            className="border p-2 rounded"
                        />
                        <input
                            type="number"
                            placeholder="Min Budget"
                            name="budgetMin"
                            value={search.budgetMin}
                            onChange={handleSearchChange}
                            className="border p-2 rounded"
                        />
                        <input
                            type="number"
                            placeholder="Max Budget"
                            name="budgetMax"
                            value={search.budgetMax}
                            onChange={handleSearchChange}
                            className="border p-2 rounded"
                        />
                        <select
                            name="gender"
                            value={search.gender}
                            onChange={handleSearchChange}
                            className="border p-2 rounded"
                        >
                            <option value="">Preferred Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="any">Any</option>
                        </select>
                        <button
                            type="submit"
                            className="col-span-2 md:col-span-1 bg-green-500 text-white p-2 rounded hover:bg-green-600"
                        >
                            Search
                        </button>
                    </form>

                    {/* User Cards */}
                    {users.length === 0 ? (
                        <div className="text-gray-500">No users found.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {users.map((u) => (
                                <UserCard key={u.id} user={u} onChat={() => openChat(u.id)} />
                            ))}
                        </div>
                    )}
                </>
            )}

            {openChats.map((chat) => (
                <ChatWindow
                    key={chat.chatId}
                    chatId={chat.chatId}
                    minimized={chat.minimized}
                    onClose={() => closeChat(chat.chatId)}
                    onToggleMinimize={() => toggleMinimize(chat.chatId)}
                />
            ))}
        </div>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="p-4 border rounded shadow bg-white flex flex-col">
            <span className="text-gray-500">{title}</span>
            <span className="text-2xl font-bold">{value}</span>
        </div>
    );
}

function UserManagement({ users, openChat, userRole }) {
    return (
        <div className="mt-6 bg-white p-4 rounded shadow">
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
                                <button
                                    onClick={() => openChat(u.id)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                >
                                    Chat
                                </button>
                                {userRole === "superAdmin" && (
                                    <>
                                        <button
                                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                            onClick={() => console.log("Promote", u.id)}
                                        >
                                            Promote
                                        </button>
                                        <button
                                            className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                                            onClick={() => console.log("Demote", u.id)}
                                        >
                                            Demote
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
