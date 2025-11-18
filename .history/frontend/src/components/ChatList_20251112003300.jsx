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
