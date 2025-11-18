import { User } from "../models/user.js";
try {
const { id } = req.params;
if (req.user.id === parseInt(id, 10)) return res.status(400).json({ message: "You cannot delete your own account" });


// Soft delete
const deleted = await User.destroy({ where: { id } });
if (!deleted) return res.status(404).json({ message: "User not found" });


await logAction({ actorId: req.user.id, targetId: id, action: 'delete', details: {}, req });


res.json({ message: "User deleted (soft)" });
} catch (error) {
res.status(500).json({ message: "Failed to delete user", error: error.message });
}
import { logAction } from "../utils/auditLogger.js";


// Superadmin-only: hard delete and cleanup
export const hardDeleteUser = async (req, res) => {
try {
const { id } = req.params;
if (req.user.role !== 'superadmin') return res.status(403).json({ message: 'Only superadmin can hard-delete users' });


// Force true to hard delete
const deleted = await User.destroy({ where: { id }, force: true });
if (!deleted) return res.status(404).json({ message: 'User not found' });


await logAction({ actorId: req.user.id, targetId: id, action: 'hard_delete', details: {}, req });


res.json({ message: 'User permanently deleted' });
} catch (err) {
res.status(500).json({ message: 'Failed to hard delete', error: err.message });
}
};


// System overview for superadmin
export const systemOverview = async (req, res) => {
try {
const totalUsers = await User.count();
const bannedUsers = await User.count({ where: { banned: true } });
const admins = await User.count({ where: { role: 'admin' } });
const superadmins = await User.count({ where: { role: 'superadmin' } });


res.json({ totalUsers, bannedUsers, admins, superadmins });
} catch (err) {
res.status(500).json({ message: 'Failed to get system overview', error: err.message });
}
};