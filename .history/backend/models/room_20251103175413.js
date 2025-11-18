// models/room.js
export default (sequelize, DataTypes) => {
const Room = sequelize.define('Room', {
id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
ownerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
title: { type: DataTypes.STRING(255), allowNull: true },
description: { type: DataTypes.TEXT, allowNull: true },
location: { type: DataTypes.STRING(255), allowNull: true },
roomType: { type: DataTypes.ENUM('single', 'shared', 'studio', 'any'), allowNull: true },
budget: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
preferences: { type: DataTypes.TEXT, allowNull: true },
}, {
tableName: 'rooms',
timestamps: true,
});


return Room;
};