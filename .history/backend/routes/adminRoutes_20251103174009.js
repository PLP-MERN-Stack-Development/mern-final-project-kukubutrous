import express from 'express';
import {
    getAllUsers,
    getUserById,
    updateUser,
    setUserBanStatus,
    changeUserRole,
    deleteUser,
    hardDeleteUser,
    systemOverview,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';


const router = express.Router();
router.use(protect);


// Admin & Superadmin main actions
router.get('/users', authorizeRoles('admin', 'superadmin'), getAllUsers);
router.get('/users/:id', authorizeRoles('admin', 'superadmin'), getUserById);
router.put('/users/:id', authorizeRoles('admin', 'superadmin'), updateUser);
router.put('/users/:id/ban', authorizeRoles('admin', 'superadmin'), setUserBanStatus);
router.put('/users/:id/role', authorizeRoles('admin', 'superadmin'), changeUserRole);
router.delete('/users/:id', authorizeRoles('admin', 'superadmin'), deleteUser);