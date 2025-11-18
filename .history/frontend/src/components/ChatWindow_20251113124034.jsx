//frontend/src/components/ChatWindow
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";
import api from "../utils/api";

// Replace with your backend socket URL
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";
const socket = io(SOCKET_URL, { transports: ["websocket"] });

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
                                className={`p-2 rounded-lg max-w-[70%] break-words ${isMe ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
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
