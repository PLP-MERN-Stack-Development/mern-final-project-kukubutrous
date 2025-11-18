
// backend/src/routes/messageRoutes.js

import express from "express";
import { upload } from "../middleware/upload.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { sendMessage, sendFileMessage, getMessages } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", verifyToken, sendMessage);
router.post("/file", verifyToken, upload.single("file"), sendFileMessage);
router.get("/:chatId", verifyToken, getMessages);

export default router;





/*

// backend/src/routes/messageRoutes.js
import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { sendMessageToChat, getMessagesForChat } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', auth, sendMessageToChat);
router.get('/:chatId', auth, getMessagesForChat);

export default router;

*/