//backend/src/models/

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import bcrypt from 'bcryptjs';


const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },


    location: { type: DataTypes.STRING },
    roomType: { type: DataTypes.STRING },
    budgetMin: { type: DataTypes.FLOAT, defaultValue: 0 },
    budgetMax: { type: DataTypes.FLOAT, defaultValue: 0 },
    hobbies: { type: DataTypes.TEXT }, // comma-separated
    gender: { type: DataTypes.STRING },
    preferredGender: { type: DataTypes.STRING },


    role: { type: DataTypes.ENUM('user', 'admin', 'superAdmin'), defaultValue: 'user' },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    verifyToken: { type: DataTypes.STRING },
    verifyTokenExpires: { type: DataTypes.DATE },
    resetPasswordToken: { type: DataTypes.STRING },
    resetPasswordExpires: { type: DataTypes.DATE }
}, { timestamps: true });


User.prototype.validatePassword = function (password) {
    return bcrypt.compare(password, this.passwordHash);
};


export default User;