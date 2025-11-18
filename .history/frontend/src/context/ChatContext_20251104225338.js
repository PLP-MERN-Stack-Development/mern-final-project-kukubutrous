import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const ChatContext = createContext();

export function ChatProvider({ children }){
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    // connect to backend base (strip /api)
    const url = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/api\/?$/,'');
    const s = io(url, { auth: { token } });

    s.on('connect', () => console.log('Socket connected'));
    s.on('new_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    s.on('user_typing', ({ conversationId, userId }) => {
      if (userId !== user?.id) {
        setTyping({ conversationId, userId });
        setTimeout(()=> setTyping(null), 2000);
      }
    });
    s.on('message_read', ({ conversationId, messageId, readerId }) => {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, read: true } : m));
    });
    s.on('adminUpdate', () => {
      // no-op here; admin pages fetch on event
    });

    setSocket(s);
    return () => s.disconnect();
  }, [user]);

  async function sendMessage(conversationId, text){
    const res = await api.post('/chats/send', { conversationId, text });
    // emit socket to inform others
    socket?.emit('private_message', { conversationId, text });
    return res.data;
  }

  function sendTyping(conversationId){
    socket?.emit('user_typing', { conversationId, userId: user.id });
  }

  function emitMessageRead(conversationId, messageId){
    socket?.emit('message_read', { conversationId, messageId, readerId: user.id });
  }

  return <ChatContext.Provider value={{ messages, sendMessage, sendTyping, emitMessageRead, typing }}>{children}</ChatContext.Provider>
}

export const useChat = () => useContext(ChatContext);
