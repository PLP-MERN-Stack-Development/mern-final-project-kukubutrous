// backendsrc/utils/io.js

let ioInstance = null;

/**
 * Store the initialized Socket.IO instance
 * @param {Server} io - The initialized socket.io server instance
 */
export function setIo(io) {
    ioInstance = io;
}

/**
 * Get the Socket.IO instance anywhere in your app
 * @returns {Server} io - The socket.io instance
 */
export function getIo() {
    if (!ioInstance) {
        throw new Error("Socket.io not initialized yet!");
    }
    return ioInstance;
}
