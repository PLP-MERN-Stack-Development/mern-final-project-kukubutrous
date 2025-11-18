//frontend/src
import React, { useState } from "react";
import ChatWindow from "./ChatWindow.jsx";

export default function UserCard({ user }) {
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMinimized, setChatMinimized] = useState(false);

    if (user.role === "admin" || user.role === "superAdmin") return null;

    const handleChatToggle = () => {
        if (chatOpen && chatMinimized) setChatMinimized(false);
        else if (!chatOpen) setChatOpen(true);
        else setChatMinimized(true);
    };

    return (
        <div className="border rounded p-4 shadow-md bg-white flex flex-col space-y-2">
            <div className="font-bold text-lg">{user.firstName} {user.lastName}</div>
            <div className="text-gray-600">Gender: {user.gender}</div>
            <div className="text-gray-600">Location: {user.location}</div>
            <div className="text-gray-600">Hobbies: {user.hobbies?.join(", ")}</div>
            <div className="text-gray-600">Room type: {user.roomType}</div>
            <div className="text-gray-600">Budget: ${user.budget}</div>

            <button
                onClick={handleChatToggle}
                className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
            >
                {chatOpen && !chatMinimized ? "Minimize Chat" : "Start Chat"}
            </button>

            {chatOpen && (
                <ChatWindow
                    chatId={user.chatId || user.id}
                    minimized={chatMinimized}
                    onClose={() => setChatOpen(false)}
                    onToggleMinimize={() => setChatMinimized((prev) => !prev)}
                />
            )}
        </div>
    );
}
