// src/pages/Inbox.jsx
import { useState, useEffect } from "react";
import API from "../utils/api";
import ChatWindow from "../components/ChatWindow";

export default function Inbox() {
    const [chats, setChats] = useState([]);
    const [openChats, setOpenChats] = useState([]);

    // Fetch all chats of the logged-in user
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await API.get("/chats"); // Assumes backend returns all user's chats
                setChats(res.data.chats || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchChats();
    }, []);

    const handleOpenChat = (chat) => {
        setOpenChats((prev) => {
            const exists = prev.find((c) => c.chatId === chat.id);
            if (exists) {
                return prev.map((c) =>
                    c.chatId === chat.id ? { ...c, minimized: false } : c
                );
            }
            return [...prev, { user: chat.user, chatId: chat.id, minimized: false }];
        });
    };

    const handleToggleMinimize = (chatId) => {
        setOpenChats((prev) =>
            prev.map((c) =>
                c.chatId === chatId ? { ...c, minimized: !c.minimized } : c
            )
        );
    };

    const handleCloseChat = (chatId) => {
        setOpenChats((prev) => prev.filter((c) => c.chatId !== chatId));
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-brightGreen mb-6">Your Chats</h1>

            {chats.length === 0 && (
                <p className="text-gray-700">You have no chats yet.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        className="border p-4 rounded-lg shadow hover:shadow-lg cursor-pointer bg-white"
                        onClick={() => handleOpenChat(chat)}
                    >
                        <h2 className="text-lg font-bold text-brightGreen">
                            {chat.user.firstName} {chat.user.lastName}
                        </h2>
                        <p className="text-sm text-gray-700">
                            Last message: {chat.lastMessage || "No messages yet"}
                        </p>
                    </div>
                ))}
            </div>

            {/* Multi-chat windows at bottom-right */}
            <div className="fixed bottom-0 right-0 flex flex-col items-end gap-2 p-4 z-50">
                {openChats
                    .filter((c) => c.minimized)
                    .map((c) => (
                        <div
                            key={c.chatId}
                            className="bg-brightGreen text-white px-4 py-2 rounded shadow cursor-pointer hover:bg-green-600"
                            onClick={() => handleToggleMinimize(c.chatId)}
                        >
                            {c.user.firstName} {c.user.lastName}
                        </div>
                    ))}

                {openChats
                    .filter((c) => !c.minimized)
                    .map((c) => (
                        <ChatWindow
                            key={c.chatId}
                            user={c.user}
                            token={localStorage.getItem("token")}
                            onClose={() => handleCloseChat(c.chatId)}
                            onMinimize={() => handleToggleMinimize(c.chatId)}
                        />
                    ))}
            </div>
        </div>
    );
}
