// frontend/src/components/ChatSidebar.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { ChatContext } from "../context/ChatContext";

export default function ChatSidebar() {
    const [users, setUsers] = useState([]);
    const [chats, setChats] = useState([]);
    const { user } = useContext(ChatContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all users
        const fetchUsers = async () => {
            try {
                const res = await api.get("/users"); // adjust endpoint
                setUsers(res.data.filter(u => u.id !== user?.id) || []);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        // Fetch recent chats
        const fetchChats = async () => {
            try {
                const res = await api.get("/chats"); // recent chats endpoint
                setChats(res.data || []);
            } catch (err) {
                console.error("Error fetching chats:", err);
            }
        };

        fetchUsers();
        fetchChats();
    }, [user]);

    const handleClick = (chatId) => {
        navigate(`/chat/${chatId}`);
    };

    return (
        <div className="w-80 border-r overflow-y-auto bg-white">
            <h2 className="font-semibold p-4 border-b">Recent Chats</h2>
            <ul>
                {chats.map((c) => (
                    <li
                        key={c.id}
                        onClick={() => handleClick(c.id)}
                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition"
                    >
                        {c.avatar ? (
                            <img
                                src={c.avatar}
                                alt={c.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                {c.name[0]}
                            </div>
                        )}
                        <span className="font-medium">{c.name}</span>
                    </li>
                ))}
            </ul>

            <h2 className="font-semibold p-4 border-t border-b">All Users</h2>
            <ul>
                {users.map((u) => (
                    <li
                        key={u.id}
                        onClick={() => handleClick(u.id)}
                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition"
                    >
                        {u.avatar ? (
                            <img
                                src={u.avatar}
                                alt={u.firstName}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                {u.firstName[0]}
                            </div>
                        )}
                        <span className="font-medium">{u.firstName} {u.lastName}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
