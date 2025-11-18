import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendMessage, getConversation, getUserChats } from "../controllers/chatController.js";

const router = express.Router();

router.post("/send", protect, sendMessage);
router.get("/conversation/:otherUserId", protect, getConversation);
router.get("/my-chats", protect, getUserChats);

export default router;
