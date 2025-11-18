// controllers/userController.js
import User from '../models/User.js';

// --- Get Logged-in User ---
export async function getMe(req, res) {
  try {
    res.json({
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      phoneNumber: req.user.phoneNumber,
      role: req.user.role,
    });
  } catch (err) {
    console.error('GetMe Error:', err);
    res.status(500).json({ message: 'Failed to fetch user info' });
  }
}

// --- Update Logged-in User ---
export async function updateMe(req, res) {
  try {
    const { firstName, lastName, phoneNumber } = req.body;

    req.user.firstName = firstName ?? req.user.firstName;
    req.user.lastName = lastName ?? req.user.lastName;
    req.user.phoneNumber = phoneNumber ?? req.user.phoneNumber;
    await req.user.save();

    res.json({ message: 'Profile updated successfully', user: req.user });
  } catch (err) {
    console.error('UpdateMe Error:', err);
    res.status(500).json({ message: 'Failed to update user' });
  }
}

// --- Search Users ---
export async function searchUsers(req, res) {
  try {
    const { q } = req.query;
    const where = q
      ? {
          [User.Sequelize.Op.or]: [
            { firstName: { [User.Sequelize.Op.like]: `%${q}%` } },
            { lastName: { [User.Sequelize.Op.like]: `%${q}%` } },
            { email: { [User.Sequelize.Op.like]: `%${q}%` } },
          ],
        }
      : {};

    const users = await User.findAll({
      where,
      attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
    });

    res.json(users);
  } catch (err) {
    console.error('SearchUsers Error:', err);
    res.status(500).json({ message: 'Failed to search users' });
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