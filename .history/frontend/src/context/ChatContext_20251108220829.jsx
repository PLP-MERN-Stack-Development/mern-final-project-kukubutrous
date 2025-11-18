import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [openChats, setOpenChats] = useState([]); // [{ chatId, minimized }]

  useEffect(() => {
    if (token) {
      const newSocket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
        auth: { token },
      });
      setSocket(newSocket);

      return () => newSocket.disconnect();
    }
  }, [token]);

  const openChat = (chatId) => {
    if (!openChats.find((c) => c.chatId === chatId)) {
      setOpenChats((prev) => [...prev, { chatId, minimized: false }]);
    }
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
      value={{ socket, openChats, openChat, closeChat, toggleMinimize }}
    >
      {children}
    </ChatContext.Provider>
  );
};
