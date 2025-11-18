// backend/src/routes/authRoutes.js
import express from "express";
import {
    register,
    login,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// Register new user
router.post("/register", register);

// Login existing user
router.post("/login", login);

// Verify email link (GET /auth/verify?token=...)
router.get("/verify", verifyEmail);

// Request password reset
router.post("/request-password-reset", requestPasswordReset);

// Reset password (POST with token in query or body)
router.post("/reset-password", resetPassword);

export default router;







/*
// backend/src/routes/authRoutes.js
import express from 'express';
import {
    register, login, verifyEmail, requestPasswordReset, resetPassword
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', verifyEmail); // or /verify/:token if you prefer
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
*/