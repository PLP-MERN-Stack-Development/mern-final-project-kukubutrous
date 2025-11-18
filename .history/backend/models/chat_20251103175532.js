// models/chat.js
export default (sequelize, DataTypes) => {
    const Chat = sequelize.define('Chat', {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        // participants can be an array of userIds for quick reference
        participants: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
        // optional title (or group chat name)
        title: { type: DataTypes.STRING(255), allowNull: true },
    }, {
        tableName: 'chats',
        timestamps: true,
    });


    return Chat;
};