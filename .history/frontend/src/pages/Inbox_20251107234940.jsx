import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Inbox() {
    const { token } = useAuth();
    const [chats, setChats] = useState([]);

    useEffect(() => {
        api.get("/chats", { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => setChats(res.data))
            .catch(() => console.log("Failed to fetch chats"));
    }, [token]);

    return (
        <div className="p-8 bg-gradient-to-br from-green-100 to-pink-100 min-h-screen">
            <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">My Inbox</h1>
            <div className="grid md:grid-cols-2 gap-6">
                {chats.length > 0 ? (
                    chats.map((chat) => (
                        <Link
                            key={chat.id}
                            to={`/chat/${chat.id}`}
                            className="block bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all"
                        >
                            <h2 className="text-xl font-semibold text-green-700">{chat.chatName}</h2>
                            <p className="text-gray-500">Participants: {chat.participants.join(", ")}</p>
                        </Link>
                    ))
                ) : (
                    <p className="text-center text-pink-600">No messages yet.</p>
                )}
            </div>
        </div>
    );
}
