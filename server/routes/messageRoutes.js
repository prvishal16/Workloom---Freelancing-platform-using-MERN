import express from 'express';
import { getMessagesForProject } from '../controllers/messageController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });
router.get('/', auth, getMessagesForProject);

export default router;