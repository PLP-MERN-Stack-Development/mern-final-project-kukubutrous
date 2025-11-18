src/models/Conversation.js`
```javascript
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';


const Conversation = sequelize.define('Conversation', {
id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
}, { timestamps: true });


const Message = sequelize.define('Message', {
id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
text: { type: DataTypes.TEXT },
read: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: true });


// Associations
Conversation.belongsToMany(User, { through: 'ConversationUsers', as: 'participants' });
User.belongsToMany(Conversation, { through: 'ConversationUsers', as: 'conversations' });
Message.belongsTo(User, { as: 'sender' });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);


export { Conversation, Message };