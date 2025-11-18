import React, { useEffect, useState, useContext, useRef } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { io } from "socket.io-client";
import { FaTimes, FaWindowMinimize, FaWindowRestore, FaPaperPlane } from "react-icons/fa";

export default function ChatWindow({ chatId, minimized, onClose, onToggleMinimize }) {
  const { user, token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Initialize Socket.io
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
      auth: { token },
    });

    socketRef.current.emit("join_chat", chatId);

    socketRef.current.on("new_message", (msg) => {
      if (msg.chatId === chatId) setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [chatId, token]);

  // Fetch previous messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${chatId}`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [chatId]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      const res = await api.post(
        "/messages",
        { chatId, content: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, res.data]);
      socketRef.current.emit("new_message", res.data);
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  if (minimized)
    return (
      <div
        className="fixed bottom-0 right-4 bg-gray-200 p-2 rounded-t-lg shadow cursor-pointer z-50"
        onClick={onToggleMinimize}
      >
        Chat #{chatId}
      </div>
    );

  return (
    <div className="fixed bottom-0 right-4 w-80 bg-white border rounded-t-lg shadow z-50 flex flex-col">
      <div className="flex justify-between items-center bg-green-500 text-white p-2 rounded-t-lg">
        <span>Chat #{chatId}</span>
        <div className="flex gap-2">
          <button onClick={onToggleMinimize}><FaWindowMinimize /></button>
          <button onClick={onClose}><FaTimes /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2" style={{ maxHeight: "300px" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded ${msg.senderId === user.id ? "bg-green-100 self-end" : "bg-gray-200 self-start"}`}
          >
            {msg.type === "text" ? (
              msg.content
            ) : (
              <a href={msg.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                File
              </a>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex p-2 border-t">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="ml-2 bg-green-500 hover:bg-green-600 text-white px-3 rounded"
          onClick={sendMessage}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
