// models/matchingEngine.js
// This is a simple placeholder - you can expand to more complex algorithms
export default (sequelize, DataTypes) => {
const MatchingEngine = sequelize.define('MatchingEngine', {
id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
name: { type: DataTypes.STRING(100), allowNull: true },
description: { type: DataTypes.TEXT, allowNull: true },
}, {
tableName: 'matching_engines',
timestamps: true,
});


// Add static helpers if desired later


return MatchingEngine;
};