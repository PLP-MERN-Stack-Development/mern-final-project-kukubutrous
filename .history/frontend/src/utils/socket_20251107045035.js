import { io } from "socket.io-client";

let socket;

export const initSocket = (token) => {
    if (!socket) {
        socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
            auth: { token },
        });
    }
    return socket;
};

export const getSocket = () => socket;
