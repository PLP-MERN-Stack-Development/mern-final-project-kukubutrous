// src/pages/Chat.jsx
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import { io } from "socket.io-client";

export default function Chat() {
    const { chatId } = useParams();
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
            auth: { token },
        });
        socketRef.current = socket;

        socket.emit("join_chat", parseInt(chatId));

        socket.on("new_message", (msg) => {
            if (msg.chatId === parseInt(chatId)) {
                setMessages((prev) => [...prev, msg]);
            }
        });

        return () => {
            socket.emit("leave_chat", parseInt(chatId));
            socket.disconnect();
        };
    }, [chatId]);

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const res = await API.get(`/chats/${chatId}`);
                setChat(res.data.chat);
                setMessages(res.data.messages || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchChat();
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!text.trim()) return;

        const msg = { chatId: parseInt(chatId), text };
        socketRef.current.emit("send_message", msg);

        setMessages((prev) => [
            ...prev,
            { ...msg, senderId: parseInt(localStorage.getItem("userId")), createdAt: Date.now() },
        ]);

        setText("");
    };

    if (!chat) return <p className="text-center mt-8">Loading chat...</p>;

    return (
        <div className="p-4 max-w-3xl mx-auto flex flex-col h-[80vh]">
            <h1 className="text-2xl font-bold text-brightGreen mb-4">
                Chat with {chat.user.firstName} {chat.user.lastName}
            </h1>

            <div className="flex-1 overflow-y-auto border rounded p-4 space-y-2 bg-gray-50">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-2 rounded max-w-[70%] break-words ${msg.senderId === parseInt(localStorage.getItem("userId"))
                                ? "bg-brightGreen text-white self-end"
                                : "bg-pink-200 text-pink-800 self-start"
                            }`}
                    >
                        <p>{msg.text}</p>
                        <small className="text-xs text-gray-600">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </small>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>

            <div className="mt-4 flex gap-2">
                <input
                    className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-brightGreen"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                    className="bg-brightPink text-white px-4 py-2 rounded hover:bg-pink-600 transition"
                    onClick={handleSend}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
