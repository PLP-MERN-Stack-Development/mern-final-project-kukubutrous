// models/index.js
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
import defineUser from './user.js';
import defineRoom from './room.js';
import defineChat from './chat.js';
import defineMessage from './message.js';
import defineReport from './report.js';
import defineMatchingEngine from './matchingEngine.js';


const db = {};


// initialize models
db.User = defineUser(sequelize, DataTypes);
db.Room = defineRoom(sequelize, DataTypes);
db.Chat = defineChat(sequelize, DataTypes);
db.Message = defineMessage(sequelize, DataTypes);
db.Report = defineReport(sequelize, DataTypes);
db.MatchingEngine = defineMatchingEngine(sequelize, DataTypes);


// Associations
// User - Room
db.User.hasMany(db.Room, { foreignKey: 'ownerId', as: 'rooms' });
db.Room.belongsTo(db.User, { foreignKey: 'ownerId', as: 'owner' });


// Chat - Message - User
// A Chat can have many Messages
db.Chat.hasMany(db.Message, { foreignKey: 'chatId', as: 'messages' });
db.Message.belongsTo(db.Chat, { foreignKey: 'chatId', as: 'chat' });


// Message belongs to a Sender (User)
db.User.hasMany(db.Message, { foreignKey: 'senderId', as: 'sentMessages' });
db.Message.belongsTo(db.User, { foreignKey: 'senderId', as: 'sender' });


// Chat participants (many-to-many via a lightweight table) - implement with belongsToMany
// We'll use a simple participants JSON on Chat for simplicity (could be normalized)


// Reports
db.Report.belongsTo(db.User, { foreignKey: 'reportedBy', as: 'reporter' });
db.Report.belongsTo(db.User, { foreignKey: 'reportedUser', as: 'reportedUser' });


// Export
db.sequelize = sequelize;
db.Sequelize = { DataTypes };


export default db;