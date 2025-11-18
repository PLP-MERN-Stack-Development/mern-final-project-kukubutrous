// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendVerificationEmail } from "../services/emailService.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    const role = (await User.count()) === 0 ? "superAdmin" : "user";

    const user = await User.create({
      firstName, lastName, phoneNumber, email, passwordHash: hash, role,
    });

    await sendVerificationEmail(user);

    res.json({ message: "Registered successfully. Check your email to verify." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.validatePassword(password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (!user.verified) return res.status(403).json({ message: "Verify your email first" });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user });
};
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(400).json({ message: "Invalid token" });   