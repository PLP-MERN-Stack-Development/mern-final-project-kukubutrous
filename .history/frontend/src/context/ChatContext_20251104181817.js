import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.js';
import api from '../utils/api.js';


const ChatContext = createContext();


export const ChatProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [typingUser, setTypingUser] = useState(null);


    useEffect(() => {
        if (!token) return;
        const s = io(import.meta.env.VITE_API_URL, {
            auth: { token },
        });


        s.on('connect', () => console.log('Connected to Socket.IO'));


        s.on('private_message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });


        s.on('user_typing', ({ conversationId, userId }) => {
            if (userId !== user.id) {
                setTypingUser(userId);
                setTimeout(() => setTypingUser(null), 2000);
            }
        });


        s.on('message_read', ({ messageId, readerId }) => {
            setMessages((prev) => prev.map(m => m.id === messageId ? { ...m, readBy: [...(m.readBy || []), readerId] } : m));
        });


        setSocket(s);
        return () => s.disconnect();
    }, [token]);


    const sendMessage = async (conversationId, text) => {
        const { data } = await api.post(`/chats/${conversationId}/messages`, { text });
        socket.emit('private_message', { conversationId, text });
        return data.message;
    };


    const sendTyping = (conversationId) => {
        if (socket) socket.emit('user_typing', { conversationId, userId: user.id });
    };


    const markMessageRead = (conversationId, messageId) => {
        if (socket) socket.emit('message_read', { conversationId, messageId, readerId: user.id });
    };


    return (
        <ChatContext.Provider value={{ messages, sendMessage, sendTyping, markMessageRead, typingUser }}>
            {children}
        </ChatContext.Provider>
    );
};


export const useChat = () => useContext(ChatContext);