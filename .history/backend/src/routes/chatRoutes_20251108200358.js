// backend/src/routes/chatRoutes.js
import express from 'express';
import auth from '../middleware/authMiddleware.js';

import { getUserChats, getMessages, sendMessage } from '../controllers/chatController.js';

const router = express.Router();

// get chats for logged in user
router.get('/', auth, getUserChats);

// get messages in a chat
router.get('/:chatId/messages', auth, getMessages);

// send message (recipientId + text in body)
router.post('/send', auth, sendMessage);

export default router;
