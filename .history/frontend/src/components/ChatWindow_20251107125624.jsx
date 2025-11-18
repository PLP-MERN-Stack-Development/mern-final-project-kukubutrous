// frontend/src/components/ChatWindow.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";
import api from "../utils/api";

export default function ChatWindow({ chatId, userId, socket }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const messagesEndRef = useRef();

    useEffect(() => {
        if (!chatId) return;

        async function fetchMessages() {
            try {
                const res = await api.get(`/chats/${chatId}/messages`);
                setMessages(res.data.messages);
            } catch (err) {
                console.error("Fetch messages error:", err);
            }
        }

        fetchMessages();

        if (!socket) return;

        const handler = (msg) => {
            if (msg.chatId === chatId) setMessages((prev) => [...prev, msg.message]);
        };

        socket.on("new_message", handler);
        return () => socket.off("new_message", handler);
    }, [chatId, socket]);

    const sendMessage = async () => {
        if (!text.trim()) return;
        try {
            await api.post(`/chats/${chatId}/messages`, { text });
            setText("");
            // Optimistic UI handled via socket event
        } catch (err) {
            console.error("Send message error:", err);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl shadow-lg p-4">
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-2 rounded-lg max-w-xs ${msg.senderId === userId
                                ? "bg-green-400 text-white ml-auto"
                                : "bg-green-200 text-green-900 mr-auto dark:bg-green-700 dark:text-green-100"
                            }`}
                    >
                        {msg.text}
                        <div className="text-xs opacity-50 mt-1 text-right">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                    </motion.div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 p-2 rounded-xl border border-green-300 dark:border-green-700 bg-white dark:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500"
                />
                <button
                    onClick={sendMessage}
                    className="bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white p-2 rounded-xl transition-colors"
                >
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
}





/*
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import api from "../utils/api";

let socket;

export default function ChatWindow({ conversationId, currentUser }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const bottomRef = useRef();

    useEffect(() => {
        // create socket if not exists
        if (!socket) {
            socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:4000", {
                auth: { token: localStorage.getItem("token") },
            });
        }

        if (conversationId) {
            socket.emit("join_chat", conversationId);

            socket.on("new_message", (payload) => {
                if (payload.chatId === conversationId) {
                    setMessages(prev => [...prev, payload.message || {
                        id: payload.message?.id || Date.now(),
                        senderId: payload.senderId,
                        text: payload.text,
                        createdAt: payload.createdAt
                    }]);
                }
            });
        }

        return () => {
            if (conversationId) {
                socket.emit("leave_chat", conversationId);
                socket.off("new_message");
            }
        };
    }, [conversationId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function loadMessages() {
        if (!conversationId) return;
        try {
            const res = await api.get(`/messages/${conversationId}`);
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => { loadMessages(); }, [conversationId]);

    async function handleSend(e) {
        e?.preventDefault();
        if (!text.trim()) return;
        try {
            // send via REST so it persists
            await api.post("/messages", { chatId: conversationId, text });
            setText("");
            // optimistic UI: message will appear via socket
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="flex flex-col h-full border rounded-xl overflow-hidden">
            <div className="p-3 bg-brand-50 border-b">
                <div className="font-semibold">Conversation</div>
            </div>

            <div className="flex-1 p-4 overflow-auto space-y-3">
                {messages.map(m => (
                    <div key={m.id} className={`max-w-[70%] p-3 rounded-2xl ${m.senderId === currentUser.id ? 'ml-auto bg-gradient-to-br from-brand-400 to-brand-500 text-white' : 'bg-gray-100'}`}>
                        <div className="text-sm">{m.text}</div>
                        <div className="text-xs text-gray-500 mt-1">{new Date(m.createdAt).toLocaleString()}</div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 border-t flex gap-2">
                <input value={text} onChange={e => setText(e.target.value)} placeholder="Write a message..." className="flex-1 px-4 py-2 rounded-full border" />
                <button type="submit" className="btn-brand">Send</button>
            </form>
        </div>
    );
}
*/