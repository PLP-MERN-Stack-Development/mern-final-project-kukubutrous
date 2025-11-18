// models/message.js
export default (sequelize, DataTypes) => {
const Message = sequelize.define('Message', {
id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
chatId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
senderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
content: { type: DataTypes.TEXT, allowNull: false },
read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
tableName: 'messages',
timestamps: true,
});


return Message;
};