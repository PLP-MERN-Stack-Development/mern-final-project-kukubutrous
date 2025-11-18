// frontend/src/components/ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../context/ChatContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../utils/api.js";
import dayjs from "dayjs";

export default function ChatWindow({ chatId, recipient, minimized, onClose, onToggleMinimize }) {
    const { socket, resetUnread } = useChat();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const [file, setFile] = useState(null);
    const endRef = useRef(null);

    // load messages for this chat
    useEffect(() => {
        if (!chatId) return;
        let mounted = true;
        (async () => {
            try {
                const res = await api.get(`/chats/${chatId}/messages`);
                if (!mounted) return;
                setMessages(Array.isArray(res.data) ? res.data : res.data.messages || []);
                resetUnread(chatId);
                socket?.emit("join_chat", chatId);
            } catch (err) {
                console.error("Load messages error:", err);
            }
        })();
        return () => {
            mounted = false;
            socket?.emit("leave_chat", chatId);
        };
    }, [chatId, socket]);

    // listen to incoming messages for this chat
    useEffect(() => {
        if (!socket) return;
        const handler = (m) => {
            if (String(m.chatId) === String(chatId)) {
                setMessages((prev) => [...prev, m]);
            }
        };
        socket.on("new_message", handler);
        return () => socket.off("new_message", handler);
    }, [socket, chatId]);

    // scroll on new messages
    useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

    const sendText = async () => {
        if (!text.trim()) return;
        setSending(true);
        try {
            // send via chat endpoint (backend ensures chat exists)
            await api.post("/chats/send", { recipientId: recipient.id, text: text.trim() });
            // server will emit new_message and we will receive it
            setText("");
        } catch (err) {
            console.error("Send text error:", err);
        } finally {
            setSending(false);
        }
    };

    const sendFile = async (f) => {
        if (!f) return;
        try {
            const fd = new FormData();
            fd.append("file", f);
            fd.append("chatId", chatId);
            await api.post("/messages/file", fd, { headers: { "Content-Type": "multipart/form-data" } });
            setFile(null);
            // server emits new_message for saved file message
        } catch (err) {
            console.error("File send error:", err);
        }
    };

    if (minimized) return null;

    return (
        <div className="w-80 md:w-96 bg-white border rounded-xl shadow-lg flex flex-col overflow-hidden">
            <div className="bg-green-500 text-white px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                        {recipient?.firstName?.[0] ?? "U"}
                    </div>
                    <div>
                        <div className="text-sm font-semibold">{recipient ? `${recipient.firstName} ${recipient.lastName || ""}` : `Chat ${chatId}`}</div>
                        <div className="text-xs opacity-80">Message</div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={onToggleMinimize} className="px-2">_</button>
                    <button onClick={onClose} className="px-2">✕</button>
                </div>
            </div>

            <div className="p-3 flex-1 overflow-y-auto space-y-3">
                {messages.map((m) => {
                    const isMe = String(m.senderId) === String(user?.id);
                    const content = m.content ?? m.text ?? "";
                    const time = m.createdAt ? dayjs(m.createdAt).format("HH:mm") : "";
                    return (
                        <div key={m.id || `${m.senderId}-${m.createdAt}`} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className={`${isMe ? "bg-green-500 text-white" : "bg-gray-100 text-gray-800"} p-2 rounded-lg max-w-[75%]`}>
                                {m.type === "text" && <div>{content}</div>}
                                {m.type === "image" && <img src={content} alt="img" className="max-h-48 rounded" />}
                                {(m.type === "file" || m.type === "pdf") && <a href={content} target="_blank" rel="noreferrer" className="underline">Download</a>}
                                <div className="text-xs opacity-70 mt-1 text-right">{time}</div>
                            </div>
                        </div>
                    );
                })}
                <div ref={endRef} />
            </div>

            <div className="p-3 border-t">
                <div className="flex items-center gap-2">
                    <label htmlFor={`file-${chatId}`} className="bg-gray-100 px-3 py-2 rounded cursor-pointer text-sm">Attach</label>
                    <input id={`file-${chatId}`} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; setFile(f); sendFile(f); }} />

                    <textarea
                        rows="2"
                        placeholder="Type a message..."
                        className="flex-1 border rounded px-2 py-1 resize-none"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendText(); } }}
                    />

                    <button onClick={sendText} disabled={sending} className="bg-green-500 text-white px-3 py-2 rounded">Send</button>
                </div>
            </div>
        </div>
    );
}







/*

//frontend/src/components/ChatWindow.jsx
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
            {/* Header *}
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

            {/* Messages *}
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

            {/* Input *}
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
*/