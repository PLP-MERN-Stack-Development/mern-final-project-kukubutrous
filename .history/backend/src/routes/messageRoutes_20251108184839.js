






// backend/src/routes/messageRoutes.js
import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { sendMessageToChat, getMessagesForChat } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', auth, sendMessageToChat);
router.get('/:chatId', auth, getMessagesForChat);

export default router;

*/