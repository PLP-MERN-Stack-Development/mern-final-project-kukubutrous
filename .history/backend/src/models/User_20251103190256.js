// src/models/User.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcryptjs";

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  phoneNumber: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },

  location: DataTypes.STRING,
  roomType: DataTypes.STRING,
  budgetMin: DataTypes.FLOAT,
  budgetMax: DataTypes.FLOAT,
  hobbies: DataTypes.TEXT,
  gender: DataTypes.STRING,
  preferredGender: DataTypes.STRING,

  role: { type: DataTypes.ENUM("user", "admin", "superAdmin"), defaultValue: "user" },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false },
});

User.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

export default User;
