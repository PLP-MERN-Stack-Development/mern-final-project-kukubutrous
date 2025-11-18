// backend/src/controllers/adminController.js
import { User } from '../models/index.js';
import { getIo } from '../utils/io.js';

export async function listUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash', 'verifyToken', 'resetPasswordToken'] },
      order: [['createdAt', 'DESC']],
    });
    return res.json({ users });
  } catch (err) {
    console.error('List users error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'admin', 'superAdmin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });

    // Prevent non-superAdmin from assigning superAdmin
    if (req.user.role !== 'superAdmin' && role === 'superAdmin') {
      return res.status(403).json({ message: 'Insufficient privileges to assign superAdmin role' });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    try { getIo().emit('admin_user_update', { action: 'role_changed', user: { id: user.id, role: user.role } }); } catch (e) {}

    return res.json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Update role error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();

    try { getIo().emit('admin_user_update', { action: 'deleted', user: { id } }); } catch (e) {}

    return res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Delete user error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
