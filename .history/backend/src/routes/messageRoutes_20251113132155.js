//backend/src/routes/message
import express from "express";
import { upload } from "../middleware/upload.js";
import { auth } from "../middleware/authMiddleware.js";
import { sendMessage, sendFileMessage, getMessages } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", auth, sendMessage);
router.post("/file", auth, upload.single("file"), sendFileMessage);
router.get("/:chatId", auth, getMessages);

export default router;
