// backend/src/models/index.js
// Centralized loader to avoid circular imports and to wire associations
import User from './User.js';
import Chat from './Chat.js';
import Message from './Message.js';

// Associations
// Chat belongsTo User twice (user1 and user2)
Chat.belongsTo(User, { as: 'user1', foreignKey: 'user1Id' });
Chat.belongsTo(User, { as: 'user2', foreignKey: 'user2Id' });

// Messages
Message.belongsTo(Chat, { as: 'chat', foreignKey: 'chatId', onDelete: 'CASCADE' });
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Chat.hasMany(Message, { as: 'messages', foreignKey: 'chatId', onDelete: 'CASCADE' });

// Export models
export { User, Chat, Message };
export default { User, Chat, Message };
