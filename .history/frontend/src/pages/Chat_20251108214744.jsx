import React, { useState, useEffect, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import MessageBubble from "../components/MessageBubble";
import FileUpload from "../components/FileUpload";
import api from "../utils/api";

export default function Chat({ chatId }) {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await api.get(`/messages/${chatId}`);
      setMessages(res.data);
    };
    fetchMessages();

    if (socket) {
      socket.on("new_message", (msg) => {
        if (msg.chatId === chatId) setMessages((prev) => [...prev, msg]);
      });
    }

    return () => socket?.off("new_message");
  }, [chatId, socket]);

  const handleSend = async () => {
    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("chatId", chatId);
        await api.post("/messages/file", formData);
        setFile(null);
      } else if (text.trim()) {
        await api.post("/messages", { chatId, content: text });
        setText("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isMine={msg.senderId === user.id} />
        ))}
      </div>
      <div className="space-y-2">
        <FileUpload onFile={setFile} />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border rounded px-3 py-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={handleSend} className="bg-green-500 text-white px-4 py-2 rounded">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
