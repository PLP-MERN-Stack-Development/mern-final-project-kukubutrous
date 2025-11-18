// backend/src/controllers/chatController.js
import { Op } from "sequelize";
import { Chat, Message, User } from "../models/index.js";
import { getIo } from "../utils/io.js";

// Fetch all chats for the logged-in user
export async function getUserChats(req, res) {
    try {
        const userId = req.user.id;

        const chats = await Chat.findAll({
            where: { [Op.or]: [{ user1Id: userId }, { user2Id: userId }] },
            include: [
                { model: User, as: "user1", attributes: ["id", "firstName", "lastName", "email"] },
                { model: User, as: "user2", attributes: ["id", "firstName", "lastName", "email"] },
            ],
            order: [["updatedAt", "DESC"]],
        });

        const chatsWithLastMessage = await Promise.all(
            chats.map(async (chat) => {
                const latest = await Message.findOne({
                    where: { chatId: chat.id },
                    order: [["createdAt", "DESC"]],
                });
                return { ...chat.toJSON(), latestMessage: latest || null };
            })
        );

        res.json(chatsWithLastMessage);
    } catch (err) {
        console.error("Get Chats Error:", err);
        res.status(500).json({ message: "Failed to fetch chats" });
    }
}

// Fetch messages for a given chat
export async function getMessages(req, res) {
    try {
        const { chatId } = req.params;

        const messages = await Message.findAll({
            where: { chatId },
            include: [{ model: User, as: "sender", attributes: ["id", "firstName", "lastName"] }],
            order: [["createdAt", "ASC"]],
        });

        res.json(messages);
    } catch (err) {
        console.error("Get Messages Error:", err);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
}

// Send message (text only)
export async function sendMessage(req, res) {
    try {
        const { recipientId, text } = req.body;
        const senderId = req.user.id;

        if (!recipientId || !text.trim()) {
            return res.status(400).json({ message: "Recipient and text are required" });
        }

        // Check for existing chat or create one
        let chat = await Chat.findOne({
            where: {
                [Op.or]: [
                    { user1Id: senderId, user2Id: recipientId },
                    { user1Id: recipientId, user2Id: senderId },
                ],
            },
        });

        if (!chat) chat = await Chat.create({ user1Id: senderId, user2Id: recipientId });

        const message = await Message.create({
            chatId: chat.id,
            senderId,
            content: text,
            type: "text",
        });

        chat.updatedAt = new Date();
        await chat.save();

        // Emit real-time message event
        const io = getIo();
        io.to(`chat_${chat.id}`).emit("new_message", message);
        io.to(`user_${recipientId}`).emit("new_message", message);

        res.status(201).json(message);
    } catch (err) {
        console.error("Send Message Error:", err);
        res.status(500).json({ message: "Failed to send message" });
    }
}

*/



/*
// backend/src/controllers/chatController.js
import { Op } from 'sequelize';
import { Chat, Message, User } from '../models/index.js';
import { getIo } from '../utils/io.js';

export async function getUserChats(req, res) {
    try {
        const userId = req.user.id;

        const chats = await Chat.findAll({
            where: { [Op.or]: [{ user1Id: userId }, { user2Id: userId }] },
            include: [
                { model: User, as: 'user1', attributes: ['id', 'firstName', 'lastName', 'email'] },
                { model: User, as: 'user2', attributes: ['id', 'firstName', 'lastName', 'email'] },
                // include latest message separately
            ],
            order: [['updatedAt', 'DESC']],
        });

        // For each chat fetch latest message (separate query for clarity)
        const chatsWithLatest = await Promise.all(chats.map(async (c) => {
            const latest = await Message.findOne({
                where: { chatId: c.id },
                order: [['createdAt', 'DESC']],
            });
            return { ...c.toJSON(), latestMessage: latest ? latest.toJSON() : null };
        }));

        return res.json({ chats: chatsWithLatest });
    } catch (err) {
        console.error('Get Chats Error:', err);
        return res.status(500).json({ message: 'Server error while fetching chats' });
    }
}

export async function getMessages(req, res) {
    try {
        const { chatId } = req.params;
        if (!chatId) return res.status(400).json({ message: 'chatId required' });

        const messages = await Message.findAll({
            where: { chatId },
            include: [{ model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'email'] }],
            order: [['createdAt', 'ASC']],
        });

        return res.json({ messages });
    } catch (err) {
        console.error('Get Messages Error:', err);
        return res.status(500).json({ message: 'Server error while fetching messages' });
    }
}

export async function sendMessage(req, res) {
    try {
        const { recipientId, text } = req.body;
        const senderId = req.user.id;
        if (!recipientId || !text) return res.status(400).json({ message: 'Recipient and text required' });

        // Find or create chat (ensure pair uniqueness by ordering ids)
        const pairA = { user1Id: senderId, user2Id: recipientId };
        const pairB = { user1Id: recipientId, user2Id: senderId };

        let chat = await Chat.findOne({ where: { [Op.or]: [pairA, pairB] } });
        if (!chat) {
            // create with smaller id first to normalize if you want; here follow sender->recipient
            chat = await Chat.create({ user1Id: senderId, user2Id: recipientId });
        }

        const message = await Message.create({ chatId: chat.id, senderId, text });

        // update chat timestamp
        chat.updatedAt = new Date();
        await chat.save();

        // emit to room and to specific recipient socket if available
        try {
            const io = getIo();
            io.to(`chat_${chat.id}`).emit('new_message', {
                chatId: chat.id,
                message: { id: message.id, senderId, text, createdAt: message.createdAt }
            });
            // also emit to recipient if they are connected by userId room
            io.to(`user_${recipientId}`).emit('private_notification', { chatId: chat.id, message: message.id });
        } catch (e) {
            // ignore socket errors
        }

        return res.status(201).json({ message: 'Message sent successfully', data: message });
    } catch (err) {
        console.error('Send Message Error:', err);
        return res.status(500).json({ message: 'Server error while sending message' });
    }
}
*/