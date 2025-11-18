src/routes/chatRoutes.js`
```javascript
import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { getConversations, createOrGetConversation, sendMessage } from '../controllers/chatController.js';


const router = express.Router();
router.get('/', auth, getConversations);
router.post('/', auth, createOrGetConversation);
router.post('/:id/messages', auth, sendMessage);
export default router