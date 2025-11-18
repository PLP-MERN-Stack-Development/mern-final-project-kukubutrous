import { useContext, useState, useEffect, useRef } from 'react';
import { ChatContext } from '../context/ChatContext';
import apiClient from '../utils/apiClient';

export default function ChatWindow() {
    const { activeChat, messages, sendMessage } = useContext(ChatContext);
    const [text, setText] = useState('');
    const messagesEnd = useRef(null);

    const chatMessages = activeChat ? messages[activeChat.id] || [] : [];

    const handleSend = (e) => {
        e.preventDefault();
        if (!text.trim() || !activeChat) return;
        sendMessage(activeChat.id, text.trim());
        setText('');
    };

    useEffect(() => {
        messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    if (!activeChat) return <div className="flex-1 flex items-center justify-center">Select a chat</div>;

    return (
        <div className="flex-1 flex flex-col bg-gray-50 h-screen p-4">
            <h4 className="font-bold mb-2">
                Chat with {activeChat.user1.id === activeChat.activeUser?.id ? activeChat.user2.firstName : activeChat.user1.firstName}
            </h4>
            <div className="flex-1 overflow-y-auto mb-4">
                {chatMessages.map(msg => (
                    <div
                        key={msg.id}
                        className={`p-2 my-1 rounded max-w-xs ${msg.senderId === activeChat.activeUser?.id ? 'bg-green-200 ml-auto' : 'bg-white'
                            }`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEnd} />
            </div>
            <form onSubmit={handleSend} className="flex gap-2">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded"
                />
                <button type="submit" className="bg-green-500 text-white px-4 rounded">Send</button>
            </form>
        </div>
    );
}
