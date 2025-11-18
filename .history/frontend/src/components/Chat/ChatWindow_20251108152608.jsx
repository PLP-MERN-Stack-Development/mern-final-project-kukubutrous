import React, { useState, useRef, useEffect } from "react";

export default function ChatWindow({
    chat,
    sendMessage,
    onClose,
    onMinimize,
    minimized,
    onNewMessage,
    onRestore,
}) {
    const [text, setText] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        if (minimized && chat.messages.length) onNewMessage?.(chat.id);
    }, [chat.messages]);

    const handleSend = () => {
        if (!text.trim()) return;
        sendMessage(chat.id, text);
        setText("");
    };

    if (minimized)
        return (
            <div
                onClick={() => onRestore?.(chat.id)}
                className="px-3 py-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600"
            >
                {chat.userName}
            </div>
        );

    return (
        <div className="w-80 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded flex flex-col shadow-lg">
            <div className="flex justify-between items-center bg-green-500 text-white p-2 rounded-t">
                <span>{chat.userName}</span>
                <div className="flex gap-1">
                    <button onClick={() => onMinimize(chat.id)}>_</button>
                    <button onClick={() => onClose(chat.id)}>X</button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-96">
                {chat.messages.map((m) => (
                    <div
                        key={m.id}
                        className={`p-1 rounded ${m.senderId === chat.userId ? "bg-gray-200 dark:bg-gray-600 self-start" : "bg-green-100 dark:bg-green-600 self-end"
                            }`}
                    >
                        {m.text}
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>

            <div className="flex p-2 border-t border-gray-300 dark:border-gray-600">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 border rounded px-2 py-1 dark:bg-gray-600 dark:text-white"
                    placeholder="Type a message..."
                />
                <button onClick={handleSend} className="ml-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                    Send
                </button>
            </div>
        </div>
    );
}
