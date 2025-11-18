// src/models/Message.js

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Chat from "./Chat.js";
import User from "./User.js";

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  chatId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: "messages",
});

// Associations
Message.belongsTo(Chat, { foreignKey: "chatId", as: "chat" });
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });
Chat.hasMany(Message, { foreignKey: "chatId", as: "messages" });

export default Message;
