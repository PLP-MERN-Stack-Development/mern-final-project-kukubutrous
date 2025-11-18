//backend/src/controllers/admin
import User from '../models/User.js';
import { getIo } from '../utils/io.js';


export async function listUsers(req, res) {
    const users = await User.findAll({ attributes: { exclude: ['passwordHash', 'verifyToken', 'resetPasswordToken'] } });
    return res.json({ users });
}


export async function updateUserRole(req, res) {
    const { id } = req.params; const { role } = req.body;
    if (!['user', 'admin', 'superAdmin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = role; await user.save();


    const io = getIo(); if (io) io.emit('admin_user_update', { action: 'role_changed', user: { id: user.id, role: user.role } });


    return res.json({ user: { id: user.id, email: user.email, role: user.role } });
}


export async function deleteUser(req, res) {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();


    const io = getIo(); if (io) io.emit('admin_user_update', { action: 'deleted', user: { id } });


    return res.json({ message: 'User deleted' });
}