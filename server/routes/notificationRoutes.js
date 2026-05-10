import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { getNotifications, markNotificationsAsRead, getUnreadCount } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', auth, getNotifications);
router.get('/unread-count', auth, getUnreadCount);
router.patch('/read', auth, markNotificationsAsRead);

export default router;
