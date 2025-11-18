// routes/userRoutes.js
import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { getMe, updateMe, searchUsers } from '../controllers/userController.js';

const router = express.Router();

// Protected routes
router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);
router.get('/', auth, searchUsers);

export default router;





/*
import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { getMe, updateMe, searchUsers } from '../controllers/userController.js';


const router = express.Router();
router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);
router.get('/', auth, searchUsers);
export default router;

*/