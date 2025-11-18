import { useState, useEffect, useRef } from "react";

export default function ChatWindow({ user, socket, onClose }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [minimized, setMinimized] = useState(false);
    const windowRef = useRef();

    // Listen for incoming messages
    useEffect(() => {
        if (!socket) return;
        const handleMessage = (msg) => {
            if (msg.from === user.id || msg.to === user.id) {
                setMessages((prev) => [...prev, msg]);
            }
        };
        socket.on("receiveMessage", handleMessage);
        return () => socket.off("receiveMessage", handleMessage);
    }, [socket, user]);

    const handleSend = () => {
        if (!text) return;
        const message = { to: user.id, text };
        socket.emit("sendMessage", message);
        setMessages((prev) => [...prev, { ...message, fromMe: true }]);
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

            {/* Body */}
            {!minimized && (
                <>
                    {/* Messages */}
                    <div className="flex-1 p-2 overflow-y-auto h-64 space-y-2">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-2 rounded ${msg.fromMe ? "bg-brightPink text-white ml-auto" : "bg-gray-200"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}
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
