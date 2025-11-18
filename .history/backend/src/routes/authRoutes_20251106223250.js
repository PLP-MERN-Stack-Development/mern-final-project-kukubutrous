// routes/authRoutes.js
import express from 'express';
import {
  register,
  login,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
} from '../controllers/authController.js';

const router = express.Router();

// Public routes (no JWT required)
router.post('/register', register);
router.post('/login', login);
router.get('/verify', verifyEmail);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;






/*
import express from 'express';
import { register, login, verifyEmail, requestPasswordReset, resetPassword } from '../controllers/authController.js';


const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/verify', verifyEmail);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
export default router;

*/