// frontend/src/context/ChatContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { token, user } = useContext(AuthContext);
    const [openChats, setOpenChats] = useState([]);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]); // <-- track online user IDs

    useEffect(() => {
        if (!token) return;

        const base = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace("/api", "");
        const s = io(base, { auth: { token } });

        s.on("connect", () => console.log("Socket connected:", s.id));
        s.on("disconnect", () => console.log("Socket disconnected"));

        // Handle new message
        s.on("new_message", (msg) => {
            setOpenChats((prev) =>
                prev.map((c) => {
                    if (c.chatId === msg.chatId) {
                        const isMinimized = c.minimized;
                        return { ...c, unreadCount: isMinimized ? (c.unreadCount || 0) + 1 : 0 };
                    }
                    return c;
                })
            );
        });

        // Track online users
        s.on("online_users", (users) => setOnlineUsers(users)); // array of online user IDs

        setSocket(s);
        return () => s.disconnect();
    }, [token]);

    const openChat = (recipient) => {
        setOpenChats((prev) => {
            const exists = prev.find((c) => c.recipient.id === recipient.id);
            if (exists) return prev;
            return [...prev, { chatId: recipient.id, recipient, minimized: false, unreadCount: 0 }];
        });
    };

    const closeChat = (chatId) => setOpenChats((prev) => prev.filter((c) => c.chatId !== chatId));
    const toggleMinimize = (chatId) => setOpenChats((prev) =>
        prev.map((c) => c.chatId === chatId ? { ...c, minimized: !c.minimized } : c)
    );
    const resetUnread = (chatId) => setOpenChats((prev) =>
        prev.map((c) => c.chatId === chatId ? { ...c, unreadCount: 0 } : c)
    );

    return (
        <ChatContext.Provider
            value={{ openChats, openChat, closeChat, toggleMinimize, resetUnread, socket, onlineUsers }}
        >
            {children}
        </ChatContext.Provider>
    );
};

*/




/*

// frontend/src/context/ChatContext.jsx
import React, { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [openChats, setOpenChats] = useState([]);

    const openChat = (chatId) => {
        setOpenChats((prev) => {
            if (prev.find((c) => c.chatId === chatId)) return prev;
            return [...prev, { chatId, minimized: false }];
        });
    };

    const closeChat = (chatId) => {
        setOpenChats((prev) => prev.filter((c) => c.chatId !== chatId));
    };

    const toggleMinimize = (chatId) => {
        setOpenChats((prev) =>
            prev.map((c) =>
                c.chatId === chatId ? { ...c, minimized: !c.minimized } : c
            )
        );
    };

    return (
        <ChatContext.Provider
            value={{ openChats, openChat, closeChat, toggleMinimize }}
        >
            {children}
        </ChatContext.Provider>
    );
};

*/



/*
import React, { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [openChats, setOpenChats] = useState([]);

    // Open a new chat or bring it to front
    const openChat = (chatId) => {
        setOpenChats((prev) => {
            if (prev.find((c) => c.chatId === chatId)) return prev;
            return [...prev, { chatId, minimized: false }];
        });
    };

    // Close a chat window
    const closeChat = (chatId) => {
        setOpenChats((prev) => prev.filter((c) => c.chatId !== chatId));
    };

    // Minimize or restore a chat window
    const toggleMinimize = (chatId) => {
        setOpenChats((prev) =>
            prev.map((c) =>
                c.chatId === chatId ? { ...c, minimized: !c.minimized } : c
            )
        );
    };

    return (
        <ChatContext.Provider
            value={{ openChats, openChat, closeChat, toggleMinimize }}
        >
            {children}
        </ChatContext.Provider>
    );
};

*/