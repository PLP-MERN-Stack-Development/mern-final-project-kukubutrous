import React, { useEffect, useState, useRef, useContext } from "react";
import { FaTimes, FaMinus, FaPaperPlane } from "react-icons/fa";
import { ChatContext } from "../context/ChatContext";
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
        // Initialize Socket.io
        socketRef.current = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
            auth: { token: localStorage.getItem("token") },
        });

        socketRef.current.emit("join_chat", chatId);

        // Listen for new messages
        socketRef.current.on("new_message", (msg) => {
            if (msg.chatId === chatId) {
                setMessages((prev) => [...prev, msg]);
                if (minimized) setUnread((prev) => prev + 1);
            }
        });

        return () => {
            socketRef.current.emit("leave_chat", chatId);
            socketRef.current.disconnect();
        };
    }, [chatId, minimized]);

    useEffect(() => {
        // Fetch chat history
        const fetchMessages = async () => {
            try {
                const res = await api.get(`/chats/${chatId}/messages`);
                setMessages(res.data.messages || res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchMessages();
    }, [chatId]);

    useEffect(() => {
        // Scroll to bottom
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, minimized]);

    const handleSend = async () => {
        if (!text && !file) return;

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

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSend();
    };

    if (minimized)
        return (
            <div
                className="fixed bottom-2 right-2 bg-gray-700 text-white px-4 py-2 rounded cursor-pointer shadow-lg"
                onClick={() => {
                    onToggleMinimize();
                    setUnread(0);
                }}
            >
                Chat ({unread})
            </div>
        );

    return (
        <div className="fixed bottom-2 right-2 w-80 max-h-[400px] bg-white border rounded shadow-lg flex flex-col">
            <div className="bg-green-500 text-white flex justify-between items-center px-3 py-2 rounded-t">
                <span>Chat #{chatId}</span>
                <div className="flex space-x-2">
                    <button onClick={onToggleMinimize}>
                        <FaMinus />
                    </button>
                    <button onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
            </div>

            <div className="flex-1 p-2 overflow-y-auto space-y-2">
                {messages.map((msg) => (
                    <div
                        key={msg.id || msg.createdAt}
                        className={`p-2 rounded ${msg.senderId === user.id ? "bg-green-100 self-end" : "bg-gray-200 self-start"
                            }`}
                    >
                        {msg.type === "file" ? (
                            <a href={msg.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                {msg.content.split("/").pop()}
                            </a>
                        ) : (
                            <span>{msg.content}</span>
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
                <label htmlFor={`file-input-${chatId}`} className="cursor-pointer bg-gray-300 p-2 rounded">
                    📎
                </label>
                <button onClick={handleSend} className="bg-green-500 text-white p-2 rounded">
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
}
