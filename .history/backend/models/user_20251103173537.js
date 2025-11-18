import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";


export const User = sequelize.define("User", {
id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
firstName: { type: DataTypes.STRING, allowNull: false },
lastName: { type: DataTypes.STRING, allowNull: false },
phoneNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
password: { type: DataTypes.STRING, allowNull: false },
location: { type: DataTypes.STRING, allowNull: true },
roomType: { type: DataTypes.STRING, allowNull: true },
budgetRange: { type: DataTypes.STRING, allowNull: true },
hobbies: { type: DataTypes.TEXT, allowNull: true },
gender: { type: DataTypes.ENUM("Male", "Female", "Other"), allowNull: true },
preferredGender: { type: DataTypes.ENUM("Male", "Female", "Other", "Any"), allowNull: true },
role: { type: DataTypes.ENUM("user", "admin", "superadmin"), defaultValue: "user" },
banned: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
timestamps: true,
paranoid: true, // enables soft delete (deletedAt)
});