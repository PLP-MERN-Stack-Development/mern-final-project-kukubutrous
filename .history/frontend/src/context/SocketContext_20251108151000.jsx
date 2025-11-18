import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const { token } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!token) return;

        const s = io(import.meta.env.VITE_API_URL, {
            auth: { token },
        });

        s.on("connect", () => console.log("✅ Socket connected", s.id));
        s.on("disconnect", () => console.log("❌ Socket disconnected"));

        setSocket(s);

        return () => s.disconnect();
    }, [token]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
