import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function ChatWindow({ user, token, onClose }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [minimized, setMinimized] = useState(false);
    const messagesEndRef = useRef(null);
    const windowRef = useRef(null);
    const socketRef = useRef(null);

    // Connect socket on mount
    useEffect(() => {
        if (!token) return;

        const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
            auth: { token },
        });
        socketRef.current = socket;

        socket.emit("join_chat", user.chatId);

        socket.on("new_message", (msg) => {
            if (msg.chatId === user.chatId) {
                setMessages((prev) => [...prev, msg]);
            }
        });

        // Load chat history
        fetch(`${import.meta.env.VITE_API_URL}/chats/${user.chatId}/messages`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setMessages(data.messages || []))
            .catch(console.error);

        return () => {
            socket.emit("leave_chat", user.chatId);
            socket.disconnect();
        };
    }, [user.chatId, token]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!text) return;
        const msg = { chatId: user.chatId, text };
        socketRef.current.emit("send_message", msg);
        setMessages((prev) => [...prev, { ...msg, senderId: parseInt(localStorage.getItem("userId")) }]);
        setText("");
    };

    // Drag handlers
    const handleMouseDown = (e) => {
        setDragging(true);
        const rect = windowRef.current.getBoundingClientRect();
        setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseMove = (e) => {
        if (!dragging) return;
        setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseUp = () => setDragging(false);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    });

    return (
        <div
            ref={windowRef}
            className="bg-white border rounded shadow-lg w-72 flex flex-col absolute z-50"
            style={{ top: position.y, left: position.x }}
        >
            {/* Header */}
            <div
                className="bg-brightGreen text-white p-2 flex justify-between items-center rounded-t cursor-move"
                onMouseDown={handleMouseDown}
            >
                <span className="font-semibold">{user.firstName}</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setMinimized(!minimized)}
                        className="font-bold hover:text-gray-200 px-2"
                    >
                        {minimized ? "⬆" : "⬇"}
                    </button>
                    <button onClick={onClose} className="font-bold px-2 hover:text-gray-200">
                        X
                    </button>
                </div>
            </div>

            {/* Chat Body */}
            {!minimized && (
                <>
                    <div className="flex-1 p-2 overflow-y-auto h-64 space-y-2 flex flex-col">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-2 rounded max-w-[70%] break-words ${
                                    msg.senderId === parseInt(localStorage.getItem("userId"))
                                        ? "bg-brightPink text-white self-end"
                                        : "bg-gray-200 text-gray-800 self-start"
                                }`}
                            >
                                {msg.text}
                                <small className="block text-xs text-gray-500 mt-1">
                                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </small>
                            </div>
                        ))}
                        <div ref={messagesEndRef}></div>
                    </div>

                    {/* Input */}
                    <div className="flex p-2 gap-2 border-t">
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-brightGreen"
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            className="bg-brightGreen text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                            Send
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
