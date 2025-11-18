// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import UserCard from "../components/UserCard";
import ChatWindow from "../components/ChatWindow";
import api from "../utils/api";

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const { openChats, openChat, closeChat, toggleMinimize } = useContext(ChatContext);

    // State for admin stats
    const [stats, setStats] = useState({ users: 0, chats: 0 });
    // State for browsing users
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

    // Fetch users or admin stats
    const fetchData = async () => {
        try {
            setLoading(true);
            if (user.role === "admin" || user.role === "superAdmin") {
                const res = await api.get("/admin/stats");
                setStats(res.data);
            } else {
                const params = { ...search };
                const res = await api.get("/users", { params });
                // Filter out admin/superAdmin
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

    useEffect(() => {
        fetchData();
    }, [user.role]);

    const handleSearchChange = (e) => {
        setSearch({ ...search, [e.target.name]: e.target.value });
    };

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

            {/* Admin Stats */}
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

            {/* Open Chat Windows */}
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






/*
import React, { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import UserCard from "../components/UserCard";
import ChatWindow from "../components/ChatWindow";

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const { openChats, openChat, closeChat, toggleMinimize } = useContext(ChatContext);

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState({
        location: "",
        roomType: "",
        budgetMin: "",
        budgetMax: "",
        hobby: "",
        gender: "",
    });

    const [stats, setStats] = useState({ users: 0, chats: 0 });
    const [loading, setLoading] = useState(true);

    // Fetch admin stats or users
    const fetchData = async () => {
        try {
            setLoading(true);

            if (user.role === "admin" || user.role === "superAdmin") {
                const res = await api.get("/admin/stats");
                setStats(res.data);
            } else {
                await fetchUsers();
            }
        } catch (err) {
            console.error("Dashboard fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch users except self/admins
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = { ...search };
            const res = await api.get("/users", { params });

            const filtered = res.data.users.filter(
                u => u.role === "user" && u.id !== user.id
            );

            setUsers(filtered);
        } catch (err) {
            console.error("User fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user.role]);

    const handleSearchChange = e => {
        setSearch({ ...search, [e.target.name]: e.target.value });
    };

    const handleSearchSubmit = async e => {
        e.preventDefault();
        await fetchUsers();
    };

    if (loading) return <div className="p-6 text-center">Loading...</div>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-4">
                {user.role === "admin" || user.role === "superAdmin"
                    ? "Admin Dashboard"
                    : "Browse Roommates"}
            </h1>

            {/* Admin View *}
            {(user.role === "admin" || user.role === "superAdmin") ? (
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
                <>
                    {/* Search Form }
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

                    {/* User Cards *}
                    {users.length === 0 ? (
                        <p className="text-gray-500">No users found.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {users.map(u => (
                                <UserCard key={u.id} user={u} onChat={() => openChat(u.id)} />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Chat Windows *}
            {openChats.map(chat => (
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
*/