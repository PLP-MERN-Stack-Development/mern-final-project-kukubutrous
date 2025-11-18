import React, { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext.js';


const ChatWindow = ({ conversation }) => {
    const { messages, sendMessage, sendTyping, markMessageRead, typingUser } = useChat();
    const [text, setText] = useState('');


    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        await sendMessage(conversation.id, text);
        setText('');
    };


    const handleTyping = () => {
        sendTyping(conversation.id);
    };


    useEffect(() => {
        // mark all unread messages as read
        messages.forEach(m => {
            if (!m.readBy?.includes(conversation.id)) {
                markMessageRead(conversation.id, m.id);
            }
        });
    }, [messages]);


    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-3">
                {messages.map((msg) => (
                    <div key={msg.id} className={`my-1 ${msg.senderId === conversation.userId ? 'text-left' : 'text-right'}`}>
                        <p className="inline-block bg-gray-100 px-3 py-2 rounded-xl shadow-sm">{msg.text}</p>
                        {msg.readBy && msg.readBy.length > 0 && <span className="text-xs text-gray-400 ml-1">✔✔</span>}
                    </div>
                ))}
                {typingUser && <p className="text-sm text-gray-500 italic">User is typing...</p>}
            </div>
            <form onSubmit={handleSend} className="flex border-t p-2">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleTyping}
                    className="flex-1 border rounded-xl px-3 py-2"
                    placeholder="Type a message..."
                />
                <button type="submit" className="ml-2 bg-blue-500 text-white rounded-xl px-4 py-2">Send</button>
            </form>
        </div>
    );
};


export default ChatWindow;