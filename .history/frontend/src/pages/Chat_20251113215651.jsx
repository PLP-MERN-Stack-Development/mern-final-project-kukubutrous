// frontend/src/pages/Chat.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import  ChatContext  from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import MessageBubble from "../components/MessageBubble";
import FileUpload from "../components/FileUpload";
import api from "../utils/api";

export default function Chat({ recipient }) {
    const { user } = useContext(AuthContext);
    const { socket, resetUnread, onlineUsers } = useContext(ChatContext);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await api.get(`/messages/${recipient.id}`);
                setMessages(res.data || []);
                resetUnread(recipient.id);
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        };
        fetchMessages();
    }, [recipient.id]);

    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = (msg) => {
            if (msg.chatId === recipient.id) setMessages((prev) => [...prev, msg]);
        };
        socket.on("new_message", handleNewMessage);
        return () => socket.off("new_message", handleNewMessage);
    }, [socket, recipient.id]);

    useEffect(() => scrollToBottom(), [messages]);

    const handleSend = async () => {
        try {
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("chatId", recipient.id);
                await api.post("/messages/file", formData);
                setFile(null);
            } else if (text.trim()) {
                await api.post("/messages", { chatId: recipient.id, content: text });
                setText("");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const isOnline = onlineUsers.includes(recipient.id);

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="bg-gray-200 px-4 py-2 flex items-center gap-2 border-b">
                {recipient.avatar && (
                    <img src={recipient.avatar} alt={recipient.firstName} className="w-8 h-8 rounded-full object-cover" />
                )}
                <div className="flex flex-col">
                    <span className="font-semibold">{recipient.firstName} {recipient.lastName}</span>
                    <span className={`text-xs ${isOnline ? "text-green-600" : "text-gray-400"}`}>
                        {isOnline ? "Online" : "Offline"}
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} isMine={msg.senderId === user.id} />
                ))}
                <div ref={messagesEndRef}></div>
            </div>

            {/* Input Area */}
            <div className="space-y-2 p-2 border-t">
                <FileUpload onFile={setFile} />
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 border rounded px-3 py-2"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button onClick={handleSend} className="bg-green-500 text-white px-4 py-2 rounded">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
