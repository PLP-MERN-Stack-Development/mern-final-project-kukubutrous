// frontend/src/pages/Chat.jsx
import React from "react";
import { useChat } from "../context/ChatContext";
import ChatWindow from "../components/ChatWindow";
import UserCard from "../components/UserCard";

export default function Chat() {
    const { chats, selectChat, activeChat } = useChat();

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
            {/* Sidebar */}
            <div className="w-1/3 border-r bg-white p-4 overflow-y-auto">
                <h2 className="text-2xl font-bold text-pink-500 mb-4">My Chats</h2>

                {chats.length === 0 ? (
                    <p className="text-gray-400">No chats yet.</p>
                ) : (
                    chats.map((chat) => (
                        <div key={chat.id} onClick={() => selectChat(chat.id)}>
                            <UserCard
                                user={chat.participant}
                                isActive={activeChat === chat.id}
                            />
                        </div>
                    ))
                )}
            </div>

            {/* Chat Window */}
            <div className="flex-1">
                {activeChat ? (
                    <ChatWindow />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Select a chat to start messaging 💬
                    </div>
                )}
            </div>
        </div>
    );
}
