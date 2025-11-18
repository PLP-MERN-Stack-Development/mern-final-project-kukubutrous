



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
