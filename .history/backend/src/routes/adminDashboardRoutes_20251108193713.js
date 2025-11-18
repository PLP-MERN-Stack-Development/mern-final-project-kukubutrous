import express from 'express';
import { getDashboardStats } from '../controllers/adminDashboardControllers.js';
import { auth, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /dashboard/stats - Only admins/superAdmins
router.get('/stats', auth, isAdmin, getDashboardStats);

export default router;
