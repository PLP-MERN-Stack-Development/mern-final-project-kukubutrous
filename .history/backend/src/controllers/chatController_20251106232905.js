// src/controllers/chatController.js

import { Op } from "sequelize";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { getIo } from "../utils/io.js";

/**
 * Get all chats for the logged-in user
 */
export async function getUserChats(req, res) {
    try {
        const userId = req.user.id;

        const chats = await Chat.findAll({
            where: {
                [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
            },
            include: [
                {
                    model: Message,
                    as: "messages",
                    order: [["createdAt", "DESC"]],
                    limit: 1, // latest message
                },
                {
                    model: User,
                    as: "user1",
                    attributes: ["id", "firstName", "lastName", "email"],
                },
                {
                    model: User,
                    as: "user2",
                    attributes: ["id", "firstName", "lastName", "email"],
                },
            ],
            order: [["updatedAt", "DESC"]],
        });

        res.json({ chats });
    } catch (err) {
        console.error("Get Chats Error:", err);
        res.status(500).json({ message: "Server error while fetching chats" });
    }
}

/**
 * Get messages in a specific conversation
 */
export async function getMessages(req, res) {
    try {
        const { chatId } = req.params;

        const messages = await Message.findAll({
            where: { chatId },
            include: [
                {
                    model: User,
                    as: "sender",
                    attributes: ["id", "firstName", "lastName", "email"],
                },
            ],
            order: [["createdAt", "ASC"]],
        });

        res.json({ messages });
    } catch (err) {
        console.error("Get Messages Error:", err);
        res.status(500).json({ message: "Server error while fetching messages" });
    }
}

/**
 * Send a message (creates chat if not exists)
 */
export async function sendMessage(req, res) {
    try {
        const { recipientId, text } = req.body;
        const senderId = req.user.id;

        if (!recipientId || !text) {
            return res.status(400).json({ message: "Recipient and text required" });
        }

        // Check if chat already exists
        let chat = await Chat.findOne({
            where: {
                [Op.or]: [
                    { user1Id: senderId, user2Id: recipientId },
                    { user1Id: recipientId, user2Id: senderId },
                ],
            },
        });

        if (!chat) {
            chat = await Chat.create({
                user1Id: senderId,
                user2Id: recipientId,
            });
        }

        // Create message
        const message = await Message.create({
            chatId: chat.id,
            senderId,
            text,
        });

        // Update chat timestamp
        chat.updatedAt = new Date();
        await chat.save();

        // Emit real-time message via socket
        const io = getIo();
        io.emit("new_message", {
            chatId: chat.id,
            message: {
                id: message.id,
                senderId,
                text,
                createdAt: message.createdAt,
            },
        });

        res.status(201).json({ message: "Message sent successfully", data: message });
    } catch (err) {
        console.error("Send Message Error:", err);
        res.status(500).json({ message: "Server error while sending message" });
    }
}






/*
import { Conversation, Message } from '../models/Conversation.js';
import User from '../models/User.js';


export async function getConversations(req, res) {
    const convos = await Conversation.findAll({ include: [{ model: User, as: 'participants', attributes: ['id', 'firstName', 'lastName', 'email'] }] });
    return res.json({ convos });
}


export async function createOrGetConversation(req, res) {
    const { otherUserId } = req.body;
    let convos = await Conversation.findAll({ include: [{ model: User, as: 'participants', where: { id: [req.user.id, otherUserId] } }] });
    let convo = convos.find(c => c.participants.length === 2);
    if (!convo) {
        convo = await Conversation.create();
        const other = await User.findByPk(otherUserId);
        await convo.addParticipants([req.user, other]);
    }
    return res.json({ conversation: convo });
}


export async function sendMessage(req, res) {
    const { id } = req.params; const { text } = req.body;
    const convo = await Conversation.findByPk(id);
    if (!convo) return res.status(404).json({ message: 'Conversation not found' });
    const msg = await Message.create({ text, ConversationId: convo.id, senderId: req.user.id });
    return res.json({ message: msg });
}

*/