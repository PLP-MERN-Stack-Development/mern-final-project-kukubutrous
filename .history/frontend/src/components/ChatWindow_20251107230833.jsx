// frontend/src/components/ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";

export default function ChatWindow() {
    const { messages, sendMessage, activeChat } = useChat();
    const { user } = useAuth();
    const [text, setText] = useState("");
    const messagesEndRef = useRef();

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        await sendMessage(activeChat, text);
        setText("");
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-full">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-pink-50 to-white">
                {messages.length === 0 ? (
                    <p className="text-gray-400 text-center mt-20">
                        No messages yet — say hello 👋
                    </p>
                ) : (
                    messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-3 flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-[70%] p-3 rounded-2xl shadow-md ${msg.senderId === user?.id
                                        ? "bg-green-500 text-white rounded-br-none"
                                        : "bg-pink-100 text-gray-800 rounded-bl-none"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </motion.div>
                    ))
                )}
                <div ref={messagesEndRef}></div>
            </div>

            {/* Input Box */}
            <form
                onSubmit={handleSend}
                className="flex items-center p-3 border-t bg-white"
            >
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 border rounded-full px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition"
                >
                    <FaPaperPlane />
                </button>
            </form>
        </div>
    );
}
