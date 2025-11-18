import React, { useState } from "react";
import ChatWindow from "./ChatWindow";

export default function ChatManager({ chats, sendMessage }) {
  const [activeChats, setActiveChats] = useState([]);
  const [minimizedChats, setMinimizedChats] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  const openChat = (chat) => {
    if (!activeChats.find((c) => c.id === chat.id)) setActiveChats([...activeChats, chat]);
    setMinimizedChats((prev) => prev.filter((id) => id !== chat.id));
    setUnreadCounts((prev) => ({ ...prev, [chat.id]: 0 }));
  };

  const closeChat = (id) => setActiveChats(activeChats.filter((c) => c.id !== id));
  const minimizeChat = (id) => setMinimizedChats([...minimizedChats, id]);
  const restoreChat = (id) => {
    setMinimizedChats(minimizedChats.filter((c) => c !== id));
    setUnreadCounts((prev) => ({ ...prev, [id]: 0 }));
  };

  return (
    <>
      <div className="fixed bottom-16 right-4 flex gap-2 z-50">
        {activeChats.map((chat) => (
          <ChatWindow
            key={chat.id}
            chat={chat}
            sendMessage={sendMessage}
            onClose={closeChat}
            onMinimize={minimizeChat}
            minimized={minimizedChats.includes(chat.id)}
            onNewMessage={(chatId) => setUnreadCounts({ ...unreadCounts, [chatId]: (unreadCounts[chatId] || 0) + 1 })}
            onRestore={restoreChat}
          />
        ))}
      </div>

      <div
        className={`fixed bottom-0 left-0 right-0 flex gap-2 p-2 bg-gray-100 dark:bg-gray-800 shadow-lg z-50 transition-transform duration-500 ${
          minimizedChats.length === 0 ? "translate-y-full" : "translate-y-0"
        }`}
      >
        {minimizedChats.map((id) => {
          const chat = activeChats.find((c) => c.id === id);
          if (!chat) return null;
          return (
            <button key={id} onClick={() => restoreChat(id)} className="relative px-3 py-1 bg-green-500 text-white rounded">
              {chat.userName}
              {unreadCounts[id] > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1 rounded-full">
                  {unreadCounts[id]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
