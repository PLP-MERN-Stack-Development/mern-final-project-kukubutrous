//backend/src/controllers/messageController
import { Message } from "../models/Message.js";
import { getIo } from "../utils/io.js";

export const sendFileMessage = async (req, res) => {
    try {
        const { chatId } = req.body;
        const senderId = req.user.id;
        const io = getIo();

        if (!req.file || !chatId) return res.status(400).json({ error: "File and chatId required" });

        const fileType = req.file.mimetype.startsWith("image/")
            ? "image"
            : req.file.mimetype === "application/pdf"
                ? "pdf"
                : req.file.mimetype.startsWith("video/")
                    ? "video"
                    : req.file.mimetype.startsWith("audio/")
                        ? "audio"
                        : "file";

        const fileUrl = `/uploads/${req.file.filename}`;

        const message = await Message.create({
            chatId,
            senderId,
            content: fileUrl,
            type: fileType,
        });

        io.to(`chat_${chatId}`).emit("new_message", message);

        res.status(201).json(message);
    } catch (err) {
        console.error("Error sending file message:", err);
        res.status(500).json({ error: err.message });
    }
};

