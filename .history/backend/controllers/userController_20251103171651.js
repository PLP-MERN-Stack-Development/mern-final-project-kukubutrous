import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

// 🟢 REGISTER USER
export const registerUser = async (req, res) => {
    const { firstName, lastName, phoneNumber, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            phoneNumber,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: "Registration successful", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

// 🟢 LOGIN USER
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "2h",
        });

        res.json({ message: "Login successful", token, user });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

// 🟢 UPDATE PROFILE
export const updateProfile = async (req, res) => {
    const userId = req.user.id; // from auth middleware
    try {
        const updated = await User.update(req.body, { where: { id: userId } });
        res.json({ message: "Profile updated successfully", updated });
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};

// 🟢 GET MATCHED USERS (based on filters)
export const getMatches = async (req, res) => {
    const { location, roomType, budgetRange, hobbies, gender } = req.user;
    try {
        const matches = await User.findAll({
            where: {
                location,
                roomType,
                budgetRange,
                preferredGender: gender,
            },
            attributes: { exclude: ["password"] },
        });

        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch matches", error: error.message });
    }
};
// 🟢 GET USER PROFIL   E