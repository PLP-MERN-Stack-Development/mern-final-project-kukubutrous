// frontend/src/components/ChatSidebar.jsx
import React from "react";
import { useChat } from "../context/ChatContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ChatSidebar() {
    const { chats, openChatWindow, onlineUsers } = useChat();
    const { user } = useAuth();

    const otherUser = (chat) => {
        // pick other participant object from included user1/user2
        if (chat.user1 && chat.user2) {
            return String(chat.user1.id) === String(user.id) ? chat.user2 : chat.user1;
        }
        // fallback if backend returns differently
        return chat.participant || null;
    };

    return (
        <div className="w-80 border-r bg-white h-full overflow-y-auto">
            <h2 className="p-4 font-semibold border-b">Messages</h2>

            <ul>
                {Array.isArray(chats) && chats.map((c) => {
                    const other = otherUser(c);
                    return (
                        <li key={c.id} className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3" onClick={() => openChatWindow({ id: other.id, firstName: other.firstName, lastName: other.lastName })}>
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">{other.firstName?.[0]}</div>
                            <div className="flex-1">
                                <div className="font-medium">{other.firstName} {other.lastName}</div>
                                <div className="text-sm text-gray-500 truncate">{c.latestMessage?.content ?? c.latestMessage?.text ?? "No messages yet"}</div>
                            </div>
                            <div className="text-xs text-gray-400">
                                {c.updatedAt ? new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                {onlineUsers?.includes(other.id) && <div className="w-2 h-2 bg-green-500 rounded-full inline-block ml-2" />}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
