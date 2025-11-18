// frontend/src/components/UserList.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { ChatContext } from "../context/ChatContext";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const { user } = useContext(ChatContext); // optional if you track current user

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/users"); // Adjust endpoint as needed
                setUsers(res.data || []);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };
        fetchUsers();
    }, []);

    const handleUserClick = (userId) => {
        navigate(`/chat/${userId}`); // navigate to the chat with this user
    };

    return (
        <div className="w-80 border-r overflow-y-auto bg-white">
            <h2 className="font-semibold p-4 border-b">Chats / Users</h2>
            <ul>
                {users.map((u) => (
                    <li
                        key={u.id}
                        onClick={() => handleUserClick(u.id)}
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





/*
// frontend/src/components/ChatList.jsx
import React from "react";
import { ChatContext } from "../context/ChatContext";
import Chat from "../pages/Chat";

export default function ChatList() {
    const { openChats, closeChat, toggleMinimize, resetUnread } = React.useContext(ChatContext);

    return (
        <div className="fixed bottom-0 right-0 flex flex-row-reverse gap-2 p-2 z-50">
            {openChats.map((c) => (
                <div key={c.chatId} className="w-80 bg-white border shadow-lg rounded flex flex-col">
                    <div
                        className="bg-gray-200 px-2 py-1 flex justify-between items-center cursor-pointer"
                        onClick={() => { toggleMinimize(c.chatId); resetUnread(c.chatId); }}
                    >
                        <span className="font-semibold">{c.recipient.firstName} {c.recipient.lastName}</span>
                        <div className="flex gap-1 items-center">
                            {c.unreadCount > 0 && (
                                <span className="bg-red-500 text-white rounded-full px-2 text-xs">{c.unreadCount}</span>
                            )}
                            <button onClick={(e) => { e.stopPropagation(); toggleMinimize(c.chatId); }} className="px-1">_</button>
                            <button onClick={(e) => { e.stopPropagation(); closeChat(c.chatId); }} className="px-1">x</button>
                        </div>
                    </div>

                    {!c.minimized && (
                        <div className="flex-1 h-96 overflow-y-auto">
                            <Chat recipient={c.recipient} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
*/