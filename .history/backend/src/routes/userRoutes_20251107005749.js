//backend/src/routes/user

import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { getMe, updateMe, searchUsers } from '../controllers/userController.js';

const router = express.Router();

// --- Get logged-in user's profile ---
router.get('/me', auth, getMe);

// --- Update logged-in user's profile ---
router.put('/me', auth, updateMe);

// --- Search other users (based on filters) ---
router.get('/', auth, searchUsers);

export default router;
