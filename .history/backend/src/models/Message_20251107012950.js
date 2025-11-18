// backend/src/models/Message.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Message = sequelize.define('Message', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    chatId: { type: DataTypes.INTEGER, allowNull: false },
    senderId: { type: DataTypes.INTEGER, allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    type: { type: DataTypes.ENUM('text', 'image', 'file'), defaultValue: 'text' },
}, {
    timestamps: true,
    tableName: 'messages',
});

export default Message;
