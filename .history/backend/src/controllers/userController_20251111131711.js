










/*
// backend/src/controllers/userController.js
import { Op } from 'sequelize';
import { User } from '../models/index.js';
//import User from "../models/User.js";just added
export async function getMe(req, res) {
    try {
        const user = req.user;
        if (!user) return res.status(404).json({ message: 'User not found' });
        const { passwordHash, verifyToken, resetPasswordToken, ...safeUser } = user.toJSON();
        return res.json({ user: safeUser });
    } catch (err) {
        console.error('getMe error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};//just added
export async function updateMe(req, res) {
    try {
        const allowed = [
            'firstName', 'lastName', 'phoneNumber', 'location', 'roomType', 'budgetMin', 'budgetMax',
            'hobbies', 'gender', 'preferredGender'
        ];

        allowed.forEach(key => {
            if (req.body[key] !== undefined) req.user[key] = req.body[key];
        });

        // convert hobbies array to CSV if provided as array
        if (Array.isArray(req.user.hobbies)) req.user.hobbies = req.user.hobbies.join(',');

        await req.user.save();

        const { passwordHash, verifyToken, resetPasswordToken, ...safeUser } = req.user.toJSON();
        return res.json({ user: safeUser });
    } catch (err) {
        console.error('updateMe error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}

export async function searchUsers(req, res) {
    try {
        const { location, roomType, budgetMin, budgetMax, hobby, gender } = req.query;
        const where = { role: 'user' };

        if (location) where.location = { [Op.like]: `%${location}%` };
        if (roomType) where.roomType = roomType;
        if (gender) where.gender = gender;
        if (hobby) where.hobbies = { [Op.like]: `%${hobby}%` };

        // match overlapping budgets
        if (budgetMin && budgetMax) {
            where[Op.and] = [
                { budgetMin: { [Op.lte]: parseFloat(budgetMax) } },
                { budgetMax: { [Op.gte]: parseFloat(budgetMin) } }
            ];
        } else if (budgetMin) {
            where.budgetMax = { [Op.gte]: parseFloat(budgetMin) };
        } else if (budgetMax) {
            where.budgetMin = { [Op.lte]: parseFloat(budgetMax) };
        }

        const users = await User.findAll({
            where,
            attributes: { exclude: ['passwordHash', 'verifyToken', 'resetPasswordToken'] },
            order: [['updatedAt', 'DESC']],
        });

        return res.json({ users });
    } catch (err) {
        console.error('searchUsers error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}
*/