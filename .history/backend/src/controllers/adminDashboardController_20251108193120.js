//

import User from "../models/User.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalChats = await Chat.count();
        const totalMessages = await Message.count();
        const verifiedUsers = await User.count({ where: { isVerified: true } });

        res.json({
            totalUsers,
            verifiedUsers,
            totalChats,
            totalMessages,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
