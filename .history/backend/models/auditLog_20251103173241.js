import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./user.js";


export const AuditLog = sequelize.define("AuditLog", {
id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
actorId: { type: DataTypes.INTEGER, allowNull: false },
targetId: { type: DataTypes.INTEGER, allowNull: true },
action: { type: DataTypes.STRING, allowNull: false }, // e.g., 'ban', 'promote', 'delete'
details: { type: DataTypes.JSON, allowNull: true },
ip: { type: DataTypes.STRING, allowNull: true },
userAgent: { type: DataTypes.STRING, allowNull: true },
}, {
timestamps: true,
});


// Associations (optional)
User.hasMany(AuditLog, { foreignKey: 'actorId', as: 'actions' });
AuditLog.belongsTo(User, { foreignKey: 'actorId', as: 'actor' });