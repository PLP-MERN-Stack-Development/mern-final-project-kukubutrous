//backend/src/controllers/user

import User from '../models/User.js';
import { Op } from 'sequelize';

// --- Get Logged-in User ---
export async function getMe(req, res) {
    try {
        const user = req.user;
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { passwordHash, verifyToken, resetPasswordToken, ...safeUser } = user.toJSON();
        return res.json({ user: safeUser });
    } catch (error) {
        console.error('getMe error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

// --- Update Logged-in User ---
export async function updateMe(req, res) {
    try {
        const allowed = [
            'firstName',
            'lastName',
            'phoneNumber',
            'location',
            'roomType',
            'budgetMin',
            'budgetMax',
            'hobbies',
            'gender',
            'preferredGender'
        ];

        allowed.forEach(key => {
            if (req.body[key] !== undefined) req.user[key] = req.body[key];
        });

        // Convert hobbies array to string if needed
        if (Array.isArray(req.user.hobbies)) {
            req.user.hobbies = req.user.hobbies.join(',');
        }

        await req.user.save();

        const { passwordHash, verifyToken, resetPasswordToken, ...safeUser } = req.user.toJSON();
        return res.json({ user: safeUser });
    } catch (error) {
        console.error('updateMe error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

// --- Search Users ---
export async function searchUsers(req, res) {
    try {
        const { location, roomType, budgetMin, budgetMax, hobby, gender } = req.query;
        const where = { role: 'user' };

        if (location) where.location = { [Op.like]: `%${location}%` };
        if (roomType) where.roomType = roomType;
        if (gender) where.gender = gender;
        if (hobby) where.hobbies = { [Op.like]: `%${hobby}%` };
        if (budgetMin) where.budgetMax = { [Op.gte]: parseFloat(budgetMin) };
        if (budgetMax) where.budgetMin = { [Op.lte]: parseFloat(budgetMax) };

        const users = await User.findAll({
            where,
            attributes: { exclude: ['passwordHash', 'verifyToken', 'resetPasswordToken'] }
        });

        return res.json({ users });
    } catch (error) {
        console.error('searchUsers error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}





/*

//`src/controllers/userController.js`

import User from '../models/User.js';
import { Op } from 'sequelize';


export async function getMe(req, res) {
    const user = req.user; user.passwordHash = undefined; return res.json({ user });
}


export async function updateMe(req, res) {
    const allowed = ['firstName', 'lastName', 'phoneNumber', 'location', 'roomType', 'budgetMin', 'budgetMax', 'hobbies', 'gender', 'preferredGender'];
    allowed.forEach(k => { if (req.body[k] !== undefined) req.user[k] = req.body[k]; });
    if (req.user.hobbies && Array.isArray(req.user.hobbies)) req.user.hobbies = req.user.hobbies.join(',');
    await req.user.save(); req.user.passwordHash = undefined; return res.json({ user: req.user });
}


export async function searchUsers(req, res) {
    const { location, roomType, budgetMin, budgetMax, hobby, gender } = req.query;
    const where = { role: 'user' };
    if (location) where.location = { [Op.like]: `%${location}%` };
    if (roomType) where.roomType = roomType;
    if (gender) where.gender = gender;
    if (hobby) where.hobbies = { [Op.like]: `%${hobby}%` };
    if (budgetMin) where.budgetMax = { [Op.gte]: parseFloat(budgetMin) };
    if (budgetMax) where.budgetMin = { [Op.lte]: parseFloat(budgetMax) };
    const users = await User.findAll({ where, attributes: { exclude: ['passwordHash', 'verifyToken', 'resetPasswordToken'] } });
    return res.json({ users });
}

*/