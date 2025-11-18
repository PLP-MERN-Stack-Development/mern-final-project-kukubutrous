import { Message } from "../models/message.js";
import { User } from "../models/user.js";

// 🟢 Send a message
export const sendMessage = async (req, res) => {
  const senderId = req.user.id;
  const { receiverId, content } = req.body;

  if (!receiverId || !content) {
    return res.status(400).json({ message: "Receiver ID and content are required." });
  }

  try {
    const message = await Message.create({
      senderId,
      receiverId,
      content,
    });
    res.status(201).json({ message: "Message sent successfully", data: message });
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error: error.message });
  }
};

// 🟢 Get conversation between two users
export const getConversation = async (req, res) => {
  const userId = req.user.id;
  const { otherUserId } = req.params;

  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      order: [["timestamp", "ASC"]],
      include: [
        { model: User, as: "sender", attributes: ["id", "firstName", "lastName", "email"] },
        { model: User, as: "receiver", attributes: ["id", "firstName", "lastName", "email"] },
      ],
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch conversation", error: error.message });
  }
};

// 🟢 Get all chats for logged-in user
export const getUserChats = async (req, res) => {
  const userId = req.user.id;

  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      include: [
        { model: User, as: "sender", attributes: ["id", "firstName", "lastName"] },
        { model: User, as: "receiver", attributes: ["id", "firstName", "lastName"] },
      ],
      order: [["timestamp", "DESC"]],
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to get messages", error: error.message });
  }
};
