// useSocket hook (frontend/src/hooks/useSocket.js)
// -----------------------------
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";


export function useSocket() {
    const socketRef = useRef(null);


    useEffect(() => {
        const url = import.meta.env.VITE_API_URL?.replace(/https?:\/\//, "")
            ? import.meta.env.VITE_API_URL
            : "http://localhost:4000";


        socketRef.current = io(url, { transports: ["websocket"] });


        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, []);


    return socketRef;
}