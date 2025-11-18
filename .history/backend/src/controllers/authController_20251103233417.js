import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from '../models/User.js';

import { sendVerificationEmail, sendResetPasswordEmail } from '../services/emailService.js';
import { signJwt } from '../utils/generateToken.js';
import { getIo } from '../utils/io.js';

// --- Register ---
export async function register(req, res) {
    try {
        const { firstName, lastName, phoneNumber, email, password } = req.body;

        const existing = await User.findOne({ where: { email } });
        if (existing)
            return res.status(400).json({ message: 'Email already registered' });

        const hash = await bcrypt.hash(password, 10);
        const count = await User.count();
        const role = count === 0 ? 'superAdmin' : 'user';

        const verifyToken = crypto.randomBytes(20).toString('hex');
        const verifyTokenExpires = new Date(Date.now() + 24 * 3600 * 1000);

        const user = await User.create({
            firstName,
            lastName,
            phoneNumber,
            email,
            passwordHash: hash,
            role,
            verifyToken,
            verifyTokenExpires,
        });

        await sendVerificationEmail(user, verifyToken);

        const io = getIo();
        if (io)
            io.emit('admin_user_update', {
                action: 'created',
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    email: user.email,
                    role: user.role,
                },
            });

        res.status(201).json({ message: 'Registered. Check email to verify.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

// --- Verify Email ---
export async function verifyEmail(req, res) {
    try {
        const { token } = req.query;
        const user = await User.findOne({ where: { verifyToken: token } });
        if (!user || new Date() > user.verifyTokenExpires)
            return res.status(400).json({ message: 'Invalid or expired token' });

        user.verified = true;
        user.verifyToken = null;
        user.verifyTokenExpires = null;
        await user.save();

        res.json({ message: 'Email verified' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

// --- Login ---
export async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const ok = await user.validatePassword(password);
        if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
        if (!user.verified) return res.status(403).json({ message: 'Please verify email' });

        const token = signToken({ id: user.id, role: user.role });

        res.json({
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

// --- Request Password Reset ---
export async function requestPasswordReset(req, res) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user)
            return res.json({ message: 'If that email exists, a reset link was sent.' });

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600 * 1000);
        await user.save();

        await sendResetPasswordEmail(user, token);
        res.json({ message: 'If that email exists, a reset link was sent.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

// --- Reset Password ---
export async function resetPassword(req, res) {
    try {
        const { token } = req.query;
        const { password } = req.body;

        const user = await User.findOne({ where: { resetPasswordToken: token } });
        if (!user || new Date() > user.resetPasswordExpires)
            return res.status(400).json({ message: 'Invalid or expired token' });

        user.passwordHash = await bcrypt.hash(password, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}
