import { useState } from "react";
import ChatWindow from "./ChatWindow";

function ChatManager({ activeChats, sendMessage }) {
  const [minimizedChats, setMinimizedChats] = useState([]);

  const closeChat = (chatId) => {
    // Remove from active chats or do any cleanup
    console.log("Close chat", chatId);
  };

  const minimizeChat = (chatId) => {
    setMinimizedChats((prev) => {
      if (!prev.includes(chatId)) return [...prev, chatId];
      return prev;
    });
  };

  const restoreChat = (chatId) => {
    setMinimizedChats((prev) => prev.filter((id) => id !== chatId));
  };

  return (
    <>
      {/* Render active chats */}
      {activeChats.map((chat, idx) => (
        <ChatWindow
          key={chat.id}
          chatId={chat.id}
          userName={chat.userName}
          messages={chat.messages}
          sendMessage={sendMessage}
          closeChat={closeChat}
          positionIndex={idx}
          minimized={minimizedChats.includes(chat.id)}
          onMinimize={() => minimizeChat(chat.id)}
        />
      ))}

      {/* Minimized chat bar */}
      {minimizedChats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 flex gap-2 p-2 bg-gray-100 dark:bg-gray-800 shadow-lg z-50">
          {minimizedChats.map((id) => {
            const chat = activeChats.find((c) => c.id === id);
            if (!chat) return null;
            return (
              <button
                key={id}
                onClick={() => restoreChat(id)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                {chat.userName}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

export default ChatManager;
