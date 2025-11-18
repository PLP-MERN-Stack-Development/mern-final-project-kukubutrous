//
import express from "express";
import {
    register,
    login,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    getProfile,
    me
} from "../controllers/authController.js";

import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify", verifyEmail);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/profile", auth, getProfile);
router.get("/me", auth, me);   // ✅ add this endpoint

export default router;









/*
// backend/src/routes/authRoutes.js
import express from 'express';
import {
    register, login, verifyEmail, requestPasswordReset, resetPassword
} from '../controllers/authController.js';

// import auth middleware
import { auth } from '../middleware/authMiddleware.js';
import { getProfile } from '../controllers/authController.js'; // import the new getProfile function

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', verifyEmail); // or /verify/:token if you prefer
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

// protected route
router.get('/profile', auth, getProfile);

export default router;

*/