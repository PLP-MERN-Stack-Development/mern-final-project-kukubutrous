import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export function useSocket() {
    const socketRef = useRef(null);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
        const base = apiUrl.replace("/api", "");
        const token = localStorage.getItem("token");

        socketRef.current = io(base, {
            transports: ["websocket"],
            auth: { token },
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    return socketRef;
}
