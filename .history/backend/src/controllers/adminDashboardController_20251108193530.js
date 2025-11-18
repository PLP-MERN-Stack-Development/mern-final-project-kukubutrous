import { User, Chat, Message } from '../models/index.js';

export async function getDashboardStats(req, res) {
    try {
        const totalUsers = await User.count();
        const verifiedUsers = await User.count({ where: { isVerified: true } });
        const totalChats = await Chat.count();
        const totalMessages = await Message.count();

        return res.json({
            totalUsers,
            verifiedUsers,
            totalChats,
            totalMessages,
        });
    } catch (err) {
        console.error('Dashboard stats error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}
