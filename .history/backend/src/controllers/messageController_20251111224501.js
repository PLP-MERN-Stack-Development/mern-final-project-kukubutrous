







// backend/src/controllers/messageController.js
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import path from "path";
import { io } from "../app.js";

// 🔍 Helper: Detect file type based on mimetype
const detectFileType = (mimetype) => {
    if (mimetype.startsWith("image/")) return "image";
    if (mimetype === "application/pdf") return "pdf";
    if (mimetype.startsWith("video/")) return "video";
    return "file";
};

// 📝 Send a normal text message
export const sendMessage = async (req, res) => {
    try {
        const { chatId, content } = req.body;

        if (!chatId || !content) {
            return res.status(400).json({ error: "chatId and content are required" });
        }

        const message = await Message.create({
            chatId,
            senderId: req.user.id,
            content,
            type: "text",
        });

        io.to(chatId.toString()).emit("new_message", message);
        res.status(201).json(message);
    } catch (err) {
        console.error("Error sending message:", err);
        res.status(500).json({ error: err.message });
    }
};

// 📎 Send a file/image/video message
export const sendFileMessage = async (req, res) => {
    try {
        const { chatId } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const fileType = detectFileType(req.file.mimetype);
        const fileUrl = `/uploads/${req.file.filename}`;

        const message = await Message.create({
            chatId,
            senderId: req.user.id,
            content: fileUrl,
            type: fileType,
        });

        io.to(chatId.toString()).emit("new_message", message);
        res.status(201).json(message);
    } catch (err) {
        console.error("Error sending file message:", err);
        res.status(500).json({ error: err.message });
    }
};

// 📬 Get all messages for a chat
export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        const messages = await Message.findAll({
            where: { chatId },
            order: [["createdAt", "ASC"]],
        });

        res.json(messages);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ error: err.message });
    }
};

*/