import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import api from "../utils/api";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [socket, setSocket] = useState(null);
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeChat, setActiveChat] = useState(null);

    // Initialize socket when authenticated
    useEffect(() => {
        if (!token) return;
        const newSocket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
            auth: { token },
        });

        newSocket.on("connect", () => {
            console.log("✅ Socket connected:", newSocket.id);
        });

        newSocket.on("new_message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        setSocket(newSocket);
        return () => newSocket.disconnect();
    }, [token]);

    // Fetch user chats
    useEffect(() => {
        const fetchChats = async () => {
            if (!user) return;
            try {
                const res = await api.get("/chats");
                setChats(res.data);
            } catch (err) {
                console.error("Failed to load chats:", err);
            }
        };
        fetchChats();
    }, [user]);

    const selectChat = async (chatId) => {
        setActiveChat(chatId);
        try {
            const res = await api.get(`/chats/${chatId}/messages`);
            setMessages(res.data);
            socket.emit("join_chat", chatId);
        } catch (err) {
            console.error("Error loading messages:", err);
        }
    };

    const sendMessage = async (chatId, text) => {
        try {
            await api.post("/chats/send", { chatId, text });
            socket.emit("send_message", { chatId, text });
        } catch (err) {
            console.error("Send message failed:", err);
        }
    };

    return (
        <ChatContext.Provider
            value={{
                chats,
                messages,
                activeChat,
                selectChat,
                sendMessage,
                socket,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
