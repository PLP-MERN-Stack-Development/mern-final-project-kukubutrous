## `src/app.js` — entry with Socket.IO and wiring utils/io
app.use('/api/admin', adminRoutes);


// Sync DB
(async ()=>{
try{ await sequelize.authenticate(); await sequelize.sync({ alter: true }); console.log('DB synced'); }
catch(err){ console.error('DB error', err); }
})();


// Socket auth
import jwt from 'jsonwebtoken';
const sockets = new Map();


io.use((socket, next)=>{
const token = socket.handshake.auth?.token; if (!token) return next(new Error('auth error'));
try{ const payload = jwt.verify(token, process.env.JWT_SECRET); socket.userId = payload.id; next(); }
catch(err){ next(new Error('auth error')); }
});


io.on('connection', (socket)=>{
sockets.set(socket.userId, socket.id);
socket.on('private_message', async ({ conversationId, text })=>{
const { Message, Conversation } = await import('./models/Conversation.js');
const msg = await Message.create({ text, ConversationId: conversationId, senderId: socket.userId });
const convo = await Conversation.findByPk(conversationId, { include: { all: true } });
convo.participants.forEach(p => {
const sid = sockets.get(p.id.toString());
if (sid && sid !== socket.id) io.to(sid).emit('new_message', { conversationId, message: msg });
});
});
socket.on('disconnect', ()=> sockets.delete(socket.userId));
});


const PORT = process.env.PORT || 4000;
server.listen(PORT, ()=> console.log('Server listening on', PORT));





/*
//src/app.js` (entry, with Socket.IO)
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import sequelize from './config/db.js';


import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';


dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });


app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);


server.listen(PORT, () => console.log('Server listening on', PORT));
*/