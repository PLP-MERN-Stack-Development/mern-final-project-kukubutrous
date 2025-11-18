import React, { useEffect, useState, useRef, useContext } from "react";
import { FaTimes, FaMinus, FaPaperPlane } from "react-icons/fa";
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
        // Build socket URL from VITE_API_URL (remove '/api' part)
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
        const base = apiUrl.replace("/api", "");

        socketRef.current = io(base, {
            auth: { token: localStorage.getItem("token") },
            transports: ["websocket"],
        });

        socketRef.current.emit("join_chat", chatId);

        socketRef.current.on("new_message", (msg) => {
            // backend emits chatId as number/string — compare loosely
            if (String(msg.chatId) === String(chatId)) {
                setMessages((prev) => [...prev, msg]);
                if (minimized) setUnread((prev) => prev + 1);
            }
        });

        return () => {
            try {
                socketRef.current.emit("leave_chat", chatId);
            } catch (e) { }
            socketRef.current.disconnect();
        };
    }, [chatId, minimized]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                // chatRoutes: GET /api/chats/:chatId/messages
                const res = await api.get(`/chats/${chatId}/messages`);
                // backend returns { messages: [...] } or array — handle both
                setMessages(res.data.messages || res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchMessages();
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, minimized]);

    const handleSend = async () => {
        if (!text.trim() && !file) return;

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

    const handleFileChange = (e) => setFile(e.target.files?.[0] || null);
    const handleKeyPress = (e) => { if (e.key === "Enter") handleSend(); };

    if (minimized)
        return (
            <div
                className="fixed bottom-2 right-2 bg-gray-700 text-white px-4 py-2 rounded cursor-pointer shadow-lg"
                onClick={() => { onToggleMinimize(); setUnread(0); }}
            >
                Chat ({unread})
            </div>
        );

    return (
        <div className="fixed bottom-2 right-2 w-80 max-h-[400px] bg-white border rounded shadow-lg flex flex-col">
            <div className="bg-green-500 text-white flex justify-between items-center px-3 py-2 rounded-t">
                <span>Chat #{chatId}</span>
                <div className="flex space-x-2">
                    <button onClick={onToggleMinimize}><FaMinus /></button>
                    <button onClick={onClose}><FaTimes /></button>
                </div>
            </div>

            <div className="flex-1 p-2 overflow-y-auto space-y-2">
                {messages.map((msg) => (
                    <div
                        key={msg.id || msg.createdAt}
                        className={`p-2 rounded ${String(msg.senderId) === String(user?.id) ? "bg-green-100 self-end" : "bg-gray-200 self-start"}`}
                    >
                        {(msg.type === "file" || msg.type === "image" || msg.type === "video" || msg.type === "audio") ? (
                            // if backend stores 'content' path: show link or embed
                            msg.type === "image" ? (
                                <img src={msg.content} alt="img" className="max-h-32 rounded" />
                            ) : msg.type === "video" ? (
                                <video src={msg.content} controls className="max-h-40 rounded" />
                            ) : msg.type === "audio" ? (
                                <audio src={msg.content} controls />
                            ) : (
                                <a href={msg.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                    {msg.content.split("/").pop()}
                                </a>
                            )
                        ) : (
                            <span>{msg.content ?? msg.text ?? msg} </span>
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
                <label htmlFor={`file-input-${chatId}`} className="cursor-pointer bg-gray-300 p-2 rounded">📎</label>
                <button onClick={handleSend} className="bg-green-500 text-white p-2 rounded"><FaPaperPlane /></button>
            </div>
        </div>
    );
}
*/