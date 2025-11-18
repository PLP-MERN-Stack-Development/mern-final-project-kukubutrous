// src/pages/Chat.jsx
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import { io } from "socket.io-client";

export default function Chat() {
    const { chatId } = useParams();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Connect socket
        const token = localStorage.getItem("token");
        const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
            auth: { token }
        });
        socketRef.current = socket;

        socket.emit("join_chat", chatId);

        socket.on("new_message", (msg) => {
            if (msg.chatId === parseInt(chatId)) {
                setMessages((prev) => [...prev, msg]);
            }
        });

        return () => {
            socket.emit("leave_chat", chatId);
            socket.disconnect();
        };
    }, [chatId]);

    useEffect(() => {
        API.get(`/chats/${chatId}/messages`).then(res => setMessages(res.data.messages));
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!text) return;
        socketRef.current.emit("send_message", { chatId, text });
        setText("");
    };

    return (
        <div className="p-4 max-w-3xl mx-auto flex flex-col h-[80vh]">
            <div className="flex-1 overflow-y-auto border rounded p-4 space-y-2 bg-gray-50">
                {messages.map(msg => (
                    <div key={msg.id} className={`p-2 rounded ${msg.senderId === parseInt(localStorage.getItem('userId')) ? 'bg-brightGreen text-white self-end' : 'bg-pink-200 text-pink-800 self-start'}`}>
                        <p>{msg.text}</p>
                        <small className="text-xs text-gray-600">{new Date(msg.createdAt).toLocaleTimeString()}</small>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>
            <div className="mt-4 flex gap-2">
                <input
                    className="flex-1 border p-2 rounded"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                />
                <button className="bg-brightPink text-white px-4 py-2 rounded hover:bg-pink-600 transition" onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}
