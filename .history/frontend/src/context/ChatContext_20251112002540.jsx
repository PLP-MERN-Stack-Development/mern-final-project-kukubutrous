





/

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