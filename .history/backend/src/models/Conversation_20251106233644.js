// src/models/Chat.js

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Chat = sequelize.define("Chat", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user1Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user2Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: "chats",
});

// Associations
Chat.belongsTo(User, { as: "user1", foreignKey: "user1Id" });
Chat.belongsTo(User, { as: "user2", foreignKey: "user2Id" });

export default Chat;
