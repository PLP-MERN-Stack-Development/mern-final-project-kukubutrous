import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/db.js';
import jwt from 'jsonwebtoken';
import { setIo, getIo } from './utils/io.js';
import { generalLimiter } from './utils/rateLimiter.js';

// --- Routes ---
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// --- Models (ensure all are imported before sync)
import './models/in';
import './models/Conversation.js';
import './models/Message.js';

dotenv.config();

// --- App + Server setup ---
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Attach Socket.IO globally
setIo(io);

// --- Middlewares ---
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(generalLimiter); // apply rate limiter to all routes

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/admin', adminRoutes);

// --- Database Connection ---
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Database connected & models synced');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
})();

// --- SOCKET.IO AUTHENTICATION ---
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = payload.id;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

// --- SOCKET.IO EVENTS ---
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.userId}`);

  // Join personal user room
  socket.join(`user_${socket.userId}`);

  // Listen for chat join
  socket.on('join_chat', (chatId) => {
    socket.join(`chat_${chatId}`);
    console.log(`User ${socket.userId} joined chat_${chatId}`);
  });

  // Listen for leaving a chat
  socket.on('leave_chat', (chatId) => {
    socket.leave(`chat_${chatId}`);
    console.log(`User ${socket.userId} left chat_${chatId}`);
  });

  // Handle private messages
  socket.on('send_message', async ({ chatId, text }) => {
    if (!chatId || !text) return;
    console.log(`📩 Message in chat_${chatId} from user_${socket.userId}:`, text);

    // Broadcast to all users in the chat room
    io.to(`chat_${chatId}`).emit('new_message', {
      chatId,
      senderId: socket.userId,
      text,
      createdAt: new Date(),
    });
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.userId}`);
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
