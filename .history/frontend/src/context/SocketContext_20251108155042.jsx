import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { token, user } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!token || !user) return;

        const s = io(import.meta.env.VITE_API_URL || "http://localhost:4000", {
            auth: { token },
        });

        s.on("connect", () => {
            console.log("✅ Socket connected:", s.id);
            s.emit("join_user_room", user.id); // optional custom event if backend supports
        });

        s.on("disconnect", () => console.log("❌ Socket disconnected"));

        setSocket(s);

        return () => {
            s.disconnect();
            setSocket(null);
        };
    }, [token, user]);

    return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
