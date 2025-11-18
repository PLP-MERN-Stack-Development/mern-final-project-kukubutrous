

















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