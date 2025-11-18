// src/components/ChatWindow.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "../utils/api";
import { useAuth } from "../context/AuthContext";
import useDraggable from "../hooks/useDraggable";
import useResizable from "../hooks/useResizable";
import useSocket from "../hooks/useSocket";
import MessageList from "./MessageList";
import TypingIndicator from "./TypingIndicator";
import debounce from "lodash.debounce";

export default function ChatWindow({ user: recipientUser, chatId: propChatId, onClose, onMinimize }) {
    const { token, user } = useAuth();
    const [chatId, setChatId] = useState(propChatId || null);
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState({});
    const [text, setText] = useState("");
    const wrapperRef = useRef(null);
    const socketRef = useSocket(token); // ref to socket instance

    useDraggable(wrapperRef, { handleSelector: ".chat-handle" });
    useResizable(wrapperRef);

    // create-or-get chat (Use A)
    useEffect(() => {
        let mounted = true;
        async function createFind() {
            if (chatId || !recipientUser) return;
            try {
                const res = await axios.post("/chats/start", { recipientId: recipientUser.id });
                const id = res.data.chatId || res.data.chat?.id;
                if (mounted) setChatId(id);
            } catch (err) {
                // fallback to sending a starter message (server will create chat)
                try {
                    await axios.post("/chats/send", { recipientId: recipientUser.id, text: "__init__" });
                    const list = await axios.get("/chats");
                    const found = list.data.chats?.find(c => [c.user1?.id, c.user2?.id].includes(recipientUser.id));
                    if (mounted) setChatId(found?.id);
                } catch (e) {
                    console.error("Could not create/find chat", e);
                }
            }
        }
        createFind();
        return () => { mounted = false; };
    }, [recipientUser]);

    // fetch messages
    useEffect(() => {
        if (!chatId) return;
        let cancelled = false;
        axios.get(`/chats/${chatId}/messages`).then(res => {
            if (!cancelled) setMessages(res.data.messages || []);
        }).catch(console.error);
        return () => cancelled = true;
    }, [chatId]);

    // socket wiring
    useEffect(() => {
        const s = socketRef.current;
        if (!s) return;
        if (chatId) s.emit("join_chat", chatId);

        function onNew(payload) {
            if (String(payload.chatId) === String(chatId)) {
                setMessages(prev => [...prev, { ...payload, status: "sent" }]);
            }
        }
        function onTyping({ chatId: cId, userId, typing }) {
            if (String(cId) !== String(chatId)) return;
            setTyping(prev => ({ ...prev, [userId]: typing }));
            if (typing) setTimeout(() => setTyping(prev => ({ ...prev, [userId]: false })), 5000);
        }
        function onDelivered({ chatId: cId, messageId }) {
            if (String(cId) !== String(chatId)) return;
            setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status: "delivered" } : m));
        }
        function onRead({ chatId: cId, messageId }) {
            if (String(cId) !== String(chatId)) return;
            setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status: "read" } : m));
        }

        s.on("new_message", onNew);
        s.on("typing", onTyping);
        s.on("message_delivered", onDelivered);
        s.on("message_read", onRead);

        return () => {
            s.off("new_message", onNew);
            s.off("typing", onTyping);
            s.off("message_delivered", onDelivered);
            s.off("message_read", onRead);
            if (chatId) s.emit("leave_chat", chatId);
        };
    }, [socketRef.current, chatId]);

    // emit typing (debounced)
    const emitTyping = useCallback(debounce((v) => {
        const s = socketRef.current;
        if (!s || !chatId) return;
        s.emit("typing", { chatId, typing: v });
    }, 350), [chatId, socketRef.current]);

    function onChange(e) {
        setText(e.target.value);
        emitTyping(e.target.value.length > 0);
    }

    async function send(e) {
        e?.preventDefault();
        if (!text.trim() || !chatId) return;
        const tempId = `tmp-${Date.now()}`;
        const optimistic = { id: tempId, chatId, senderId: user.id, text, createdAt: new Date().toISOString(), status: "sending" };
        setMessages(prev => [...prev, optimistic]);
        setText("");
        emitTyping(false);

        try {
            const res = await axios.post("/chats/send", { recipientId: recipientUser?.id || null, text });
            const serverMsg = res.data.data || res.data.message || res.data;
            setMessages(prev => prev.map(m => m.id === tempId ? { ...serverMsg, status: "sent" } : m));
        } catch (err) {
            setMessages(prev => prev.map(m => m.id === tempId ? { ...m, status: "failed" } : m));
            console.error("send error", err);
        }
    }

    const typingNames = Object.entries(typing).filter(([id, v]) => v && String(id) !== String(user.id)).map(([id]) => (recipientUser && String(recipientUser.id) === String(id)) ? `${recipientUser.firstName}` : "Someone");

    return (
        <div ref={wrapperRef} className="chat-window draggable" style={{ position: "absolute", right: 24, bottom: 24 }}>
            <div className="chat-handle p-3 flex items-center justify-between">
                <div className="font-medium">{recipientUser ? `${recipientUser.firstName} ${recipientUser.lastName}` : `Chat ${chatId}`}</div>
                <div className="flex gap-2">
                    <button onClick={onMinimize} className="px-2">_</button>
                    <button onClick={onClose} className="px-2 text-red-500">x</button>
                </div>
            </div>

            <div className="p-3" style={{ height: "calc(100% - 160px)", overflow: "auto" }}>
                <MessageList messages={messages} meId={user.id} />
                <TypingIndicator names={typingNames} />
            </div>

            <form onSubmit={send} className="p-3 border-t">
                <textarea value={text} onChange={onChange} placeholder="Type a message" className="w-full p-2 rounded" rows={3} />
                <div className="flex justify-end mt-2">
                    <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded">Send</button>
                </div>
            </form>
        </div>
    );
}
