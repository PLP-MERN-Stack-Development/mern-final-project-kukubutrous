// frontend/src/components/ChatDock.jsx
import React from "react";
import { useChat } from "../context/ChatContext.jsx";
import ChatWindow from "./ChatWindow.jsx";

/**
 * Renders openChats from ChatContext as floating chat windows.
 * Each window is offset from the right so multiple show side-by-side.
 */
export default function ChatDock() {
  const { openChats, toggleMinimize, closeChatWindow } = useChat();

  return (
    <>
      {openChats.map((c, idx) => (
        <div
          key={c.chatId}
          className="fixed bottom-4 z-50"
          style={{ right: 16 + idx * 320 }} // offset each window by 320px
        >
          <ChatWindow
            chatId={c.chatId}
            recipient={c.recipient}
            minimized={c.minimized}
            onClose={() => closeChatWindow(c.chatId)}
            onToggleMinimize={() => toggleMinimize(c.chatId)}
          />
        </div>
      ))}
    </>
  );
}
