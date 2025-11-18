





import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import sequelize from './config/db.js';
import jwt from 'jsonwebtoken';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { setIo } from './utils/io.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
setIo(io);

app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/admin', adminRoutes);

// Database Sync
(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log('✅ Database connected & synced');
    } catch (err) {
        console.error('❌ DB connection error:', err);
    }
})();

// --- Socket.IO Authentication ---
const sockets = new Map();

io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('auth error'));
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = payload.id;
        next();
    } catch (err) {
        next(new Error('auth error'));
    }
});

// --- Socket.IO Events ---
io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);
    sockets.set(socket.userId, socket.id);

    socket.on('private_message', async ({ conversationId, text }) => {
        // handle message logic here
        console.log('Private message:', conversationId, text);
    });

    socket.on('disconnect', () => {
        sockets.delete(socket.userId);
        console.log('User disconnected:', socket.userId);
    });
});

// --- Start Server ---
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));

*/