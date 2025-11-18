// backend/src/controllers/messageController.js
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import { io } from "../a.js";

export const sendMessage = async (req, res) => {
    try {
        const { chatId, content } = req.body;
        const message = await Message.create({
            chatId,
            senderId: req.user.id,
            content,
            type: "text",
        });
        io.to(chatId.toString()).emit("new_message", message);
        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const sendFileMessage = async (req, res) => {
    try {
        const { chatId } = req.body;
        const fileUrl = `/uploads/${req.file.filename}`;
        const message = await Message.create({
            chatId,
            senderId: req.user.id,
            content: fileUrl,
            type: "file",
        });
        io.to(chatId.toString()).emit("new_message", message);
        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await Message.findAll({ where: { chatId } });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};





/*
import { Message } from '../models/index.js';

export async function sendMessageToChat(req, res) {
    try {
        const { chatId, text } = req.body;
        const senderId = req.user.id;
        if (!chatId || !text) return res.status(400).json({ message: 'chatId and text required' });

        const message = await Message.create({ chatId, senderId, text });
        return res.status(201).json(message);
    } catch (err) {
        console.error('sendMessageToChat error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}

export async function getMessagesForChat(req, res) {
    try {
        const { chatId } = req.params;
        const messages = await Message.findAll({ where: { chatId }, order: [['createdAt', 'ASC']] });
        return res.json(messages);
    } catch (err) {
        console.error('getMessagesForChat error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}
*/