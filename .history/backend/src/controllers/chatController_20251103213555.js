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