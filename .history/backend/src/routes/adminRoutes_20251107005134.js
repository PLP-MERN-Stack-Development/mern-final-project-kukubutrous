//backend

import express from 'express';
import auth from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';
import { listUsers, updateUserRole, deleteUser } from '../controllers/adminController.js';


const router = express.Router();
router.get('/users', auth, role(['admin', 'superAdmin']), listUsers);
router.put('/users/:id/role', auth, role(['superAdmin']), updateUserRole); // only superAdmin can set role to superAdmin
router.delete('/users/:id', auth, role(['admin', 'superAdmin']), deleteUser);


export default router;