import { io } from 'socket.io-client';

let socketInstance = null;

export function createSocket(token) {
    if (socketInstance) return socketInstance;
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace('/api', '');
    socketInstance = io(base, { auth: { token } });
    socketInstance.on('connect_error', (err) => console.warn('Socket connect error', err.message));
    return socketInstance;
}

export function getSocket() {
    return socketInstance;
}

export function disconnectSocket() {
    if (!socketInstance) return;
    socketInstance.disconnect();
    socketInstance = null;
}
