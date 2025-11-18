// backend/src/controllers/messageController.js






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
