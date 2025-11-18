import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import api from "../utils/api";

export default function ChatWindow({ chatId, socket, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await api.get(`/messages/${chatId}`);
      setMessages(res.data);
    };
    fetchMessages();

    socket?.on("new_message", (message) => {
      if (message.chatId === chatId) setMessages((prev) => [...prev, message]);
    });

    return () => socket?.off("new_message");
  }, [chatId, socket]);

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (text.trim()) {
      await api.post("/messages", { chatId, content: text });
      setText("");
    }
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("chatId", chatId);
      await api.post("/messages/file", formData);
      setFile(null);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border shadow rounded flex flex-col">
      <div className="flex justify-between p-2 bg-green-500 text-white rounded-t">
        <span>Chat</span>
        <FaTimes className="cursor-pointer" onClick={onClose} />
      </div>
      <div className="p-2 flex-1 overflow-y-auto space-y-2 max-h-64">
        {messages.map((msg) => (
          <div key={msg.id} className={`p-1 rounded ${msg.senderId === socket.id ? "bg-green-100 self-end" : "bg-gray-200 self-start"}`}>
            {msg.type === "text" ? msg.content : <a href={msg.content} target="_blank" rel="noreferrer" className="text-blue-600 underline">File</a>}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex p-2 border-t">
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 border rounded px-2 py-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input type="file" className="ml-1" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={sendMessage} className="ml-1 bg-green-500 text-white px-2 rounded">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
