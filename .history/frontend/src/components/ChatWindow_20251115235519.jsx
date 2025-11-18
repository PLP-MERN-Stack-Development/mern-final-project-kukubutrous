//frontend / src / components / ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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
    const [hoveredMsgId, setHoveredMsgId] = useState(null);
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
                // Mark messages as read when chat opens
                socket?.emit("mark_read", { chatId, reader: user });
            } catch (err) {
                console.error("Load messages error:", err);
            }
        })();
        return () => {
            mounted = false;
            socket?.emit("leave_chat", chatId);
        };
    }, [chatId, socket]);

    // listen to incoming messages
    useEffect(() => {
        if (!socket) return;
        const handler = (m) => {
            if (String(m.chatId) === String(chatId)) setMessages((p) => [...p, m]);
        };
        socket.on("new_message", handler);

        const readHandler = (updated) => {
            setMessages((msgs) =>
                msgs.map((m) => (updated.find((u) => u.id === m.id) ? { ...m, ...updated.find((u) => u.id === m.id) } : m))
            );
        };
        socket.on("message_read", readHandler);

        return () => {
            socket.off("new_message", handler);
            socket.off("message_read", readHandler);
        };
    }, [socket, chatId]);

    // scroll on new messages
    useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

    const sendText = async () => {
        if (!text.trim()) return;
        setSending(true);
        try {
            await api.post("/chats/send", { recipientId: recipient.id, text: text.trim() });
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
        } catch (err) {
            console.error("File send error:", err);
        }
    };

    if (minimized) return null;

    return (
        <div className="w-80 md:w-96 bg-grean border rounded-xl shadow-lg flex flex-col overflow-hidden">
            <div className="bg-green-500 text-white px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                        {recipient?.firstName?.[0] ?? "U"}
                    </div>
                    <div>
                        <div className="text-sm font-semibold">
                            {recipient ? `${recipient.firstName} ${recipient.lastName || ""}` : `Chat ${chatId}`}
                        </div>
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
                    const seenTime = m.seenAt ? dayjs(m.seenAt).format("HH:mm") : "";
                    const seenText = m.seenBy ? `Seen by ${m.seenBy} at ${seenTime}` : null;
                    const bubbleColor = isMe ? "bg-green-500 text-white" : "bg-gray-100 text-gray-800";

                    const checks =
                        isMe && m.status === "read"
                            ? "✓✓"
                            : isMe
                                ? "✓"
                                : "";

                    return (
                        <div
                            key={m.id || `${m.senderId}-${m.createdAt}`}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            onMouseEnter={() => setHoveredMsgId(m.id)}
                            onMouseLeave={() => setHoveredMsgId(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`relative ${bubbleColor} p-2 rounded-lg max-w-[75%]`}
                            >
                                {m.type === "text" && <div>{content}</div>}
                                {m.type === "image" && <img src={content} alt="img" className="max-h-48 rounded" />}
                                {(m.type === "file" || m.type === "pdf") && (
                                    <a href={content} target="_blank" rel="noreferrer" className="underline">Download</a>
                                )}
                                <div className="text-xs opacity-70 mt-1 flex justify-end gap-1 items-center">
                                    <span>{time}</span>
                                    {isMe && (
                                        <span className={m.status === "read" ? "text-blue-400" : "text-gray-400"}>
                                            {checks}
                                        </span>
                                    )}
                                </div>

                                {hoveredMsgId === m.id && seenText && (
                                    <div className="absolute -top-6 right-0 bg-black text-white text-xs rounded px-2 py-1 shadow-md">
                                        {seenText}
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    );
                })}
                <div ref={endRef} />
            </div>

            <div className="p-3 border-t">
                <div className="flex items-center gap-2">
                    <label htmlFor={`file-${chatId}`} className="bg-gray-100 px-3 py-2 rounded cursor-pointer text-sm">
                        Attach
                    </label>
                    <input
                        id={`file-${chatId}`}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            setFile(f);
                            sendFile(f);
                        }}
                    />

                    <textarea
                        rows="2"
                        placeholder="Type a message..."
                        className="flex-1 border rounded px-2 py-1 resize-none"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendText();
                            }
                        }}
                    />

                    <button onClick={sendText} disabled={sending} className="bg-green-500 text-white px-3 py-2 rounded">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

