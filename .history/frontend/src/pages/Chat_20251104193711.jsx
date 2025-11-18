import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useChat } from "../context/ChatContext";

const Chat = () => {
  const { id } = useParams();
  const { messages, sendMessage, sendTyping, markMessageRead, typingUser } = useChat();
  const [text, setText] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await sendMessage(id, text);
    setText("");
  };

  const handleTyping = () => {
    sendTyping(id);
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow">
      <div className="flex-1 overflow-y-auto p-3">
        {messages.map((msg) => (
          <div key={msg.id} className="my-1 text-sm">
            <div
              className={`inline-block px-3 py-2 rounded-xl ${
                msg.senderId === id ? "bg-gray-100" : "bg-blue-100 self-end"
              }`}
            >
              {msg.text}
            </div>
            {msg.readBy?.length > 0 && (
              <span className="text-xs text-gray-400 ml-2">✔✔</span>
            )}
          </div>
        ))}
        {typingUser && <p className="italic text-gray-500 text-sm">User is typing...</p>}
      </div>
      <form onSubmit={handleSend} className="flex border-t p-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleTyping}
          className="flex-1 border rounded-xl px-3 py-2"
          placeholder="Type a message..."
        />
        <button type="submit" className="ml-2 bg-blue-500 text-white rounded-xl px-4 py-2">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
