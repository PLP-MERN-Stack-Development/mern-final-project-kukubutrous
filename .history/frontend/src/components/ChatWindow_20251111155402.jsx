import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";
import api from "../utils/api";

// Replace with your backend socket URL
const SOCKET_URL = "http://localhost:4";

export default function ChatWindow({ chatId, minimized, onClose, onToggleMinimize }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize socket
  useEffect(() => {
    const s = io(SOCKET_URL, { query: { userId: user.id } });
    setSocket(s);

    s.emit("joinRoom", chatId);

    s.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      s.disconnect();
    };
  }, [chatId, user.id]);

  // Load previous messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${chatId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();
  }, [chatId]);

  // Scroll on new messages
  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const message = {
      senderId: user.id,
      chatId,
      text: input,
      timestamp: new Date(),
    };

    socket.emit("sendMessage", message);
    setMessages((prev) => [...prev, message]);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (minimized) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white border border-gray-300 rounded-xl shadow-lg flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="bg-green-500 text-white px-4 py-2 flex justify-between items-center">
        <span>Chat</span>
        <div className="flex space-x-2">
          <button onClick={onToggleMinimize} className="hover:opacity-80">
            _
          </button>
          <button onClick={onClose} className="hover:opacity-80">
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="p-3 flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === user.id;
          return (
            <div
              key={idx}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-2 rounded-lg max-w-[70%] break-words ${
                  isMe ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
                <div className="text-xs mt-1 text-gray-300 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200">
        <textarea
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 resize-none"
          rows="2"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        ></textarea>
        <button
          onClick={handleSend}
          className="mt-2 w-full bg-green-500 text-white py-1.5 rounded-lg hover:bg-green-600 transition font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}





/*

import React, { useEffect, useState, useRef, useContext } from "react";
import { FaTimes, FaMinus, FaPaperPlane } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { io } from "socket.io-client";

export default function ChatWindow({ chatId, minimized, onClose, onToggleMinimize }) {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [unread, setUnread] = useState(0);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Build socket URL from VITE_API_URL (remove '/api' part)
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
        const base = apiUrl.replace("/api", "");

        socketRef.current = io(base, {
            auth: { token: localStorage.getItem("token") },
            transports: ["websocket"],
        });

        socketRef.current.emit("join_chat", chatId);

        socketRef.current.on("new_message", (msg) => {
            // backend emits chatId as number/string — compare loosely
            if (String(msg.chatId) === String(chatId)) {
                setMessages((prev) => [...prev, msg]);
                if (minimized) setUnread((prev) => prev + 1);
            }
        });

        return () => {
            try {
                socketRef.current.emit("leave_chat", chatId);
            } catch (e) { }
            socketRef.current.disconnect();
        };
    }, [chatId, minimized]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                // chatRoutes: GET /api/chats/:chatId/messages
                const res = await api.get(`/chats/${chatId}/messages`);
                // backend returns { messages: [...] } or array — handle both
                setMessages(res.data.messages || res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchMessages();
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, minimized]);

    const handleSend = async () => {
        if (!text.trim() && !file) return;

        try {
            let messageData;
            if (file) {
                const formData = new FormData();
                formData.append("chatId", chatId);
                formData.append("file", file);
                const res = await api.post("/messages/file", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                messageData = res.data;
                setFile(null);
            } else {
                const res = await api.post("/messages", { chatId, content: text });
                messageData = res.data;
            }

            setMessages((prev) => [...prev, messageData]);
            setText("");
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = (e) => setFile(e.target.files?.[0] || null);
    const handleKeyPress = (e) => { if (e.key === "Enter") handleSend(); };

    if (minimized)
        return (
            <div
                className="fixed bottom-2 right-2 bg-gray-700 text-white px-4 py-2 rounded cursor-pointer shadow-lg"
                onClick={() => { onToggleMinimize(); setUnread(0); }}
            >
                Chat ({unread})
            </div>
        );

    return (
        <div className="fixed bottom-2 right-2 w-80 max-h-[400px] bg-white border rounded shadow-lg flex flex-col">
            <div className="bg-green-500 text-white flex justify-between items-center px-3 py-2 rounded-t">
                <span>Chat #{chatId}</span>
                <div className="flex space-x-2">
                    <button onClick={onToggleMinimize}><FaMinus /></button>
                    <button onClick={onClose}><FaTimes /></button>
                </div>
            </div>

            <div className="flex-1 p-2 overflow-y-auto space-y-2">
                {messages.map((msg) => (
                    <div
                        key={msg.id || msg.createdAt}
                        className={`p-2 rounded ${String(msg.senderId) === String(user?.id) ? "bg-green-100 self-end" : "bg-gray-200 self-start"}`}
                    >
                        {(msg.type === "file" || msg.type === "image" || msg.type === "video" || msg.type === "audio") ? (
                            // if backend stores 'content' path: show link or embed
                            msg.type === "image" ? (
                                <img src={msg.content} alt="img" className="max-h-32 rounded" />
                            ) : msg.type === "video" ? (
                                <video src={msg.content} controls className="max-h-40 rounded" />
                            ) : msg.type === "audio" ? (
                                <audio src={msg.content} controls />
                            ) : (
                                <a href={msg.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                    {msg.content.split("/").pop()}
                                </a>
                            )
                        ) : (
                            <span>{msg.content ?? msg.text ?? msg} </span>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-2 border-t flex items-center space-x-2">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message"
                    className="flex-1 border rounded p-2"
                />
                <input type="file" onChange={handleFileChange} className="hidden" id={`file-input-${chatId}`} />
                <label htmlFor={`file-input-${chatId}`} className="cursor-pointer bg-gray-300 p-2 rounded">📎</label>
                <button onClick={handleSend} className="bg-green-500 text-white p-2 rounded"><FaPaperPlane /></button>
            </div>
        </div>
    );
}
*/