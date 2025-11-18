//backend/src/routes/chatRoutes.js
import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import { getUserChats, getMessages, sendMessage, initChat } from '../controllers/chatController.js';

const router = express.Router();

// get chats for logged in user
router.get('/', auth, getUserChats);

// initialize or get chat with a recipient
router.post('/init', auth, initChat);

// get messages in a chat
router.get('/:chatId/messages', auth, getMessages);

// send message (recipientId + text in body)
router.post('/send', auth, sendMessage);
routerGET /api/chats

POST /api/chats/init 

POST /api/chats/send 

GET /api/chats/:chatId/messages

POST /api/messages/file

export default router;
