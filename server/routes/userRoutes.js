import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { updateMe, getUserProfile, sendConnectionRequest, getConnectionStatus, changePassword, deleteAccount, uploadAvatar   } from '../controllers/userController.js'; 
import upload from '../config/cloudinary.js';

const router = express.Router();
router.patch('/me', auth, updateMe);
router.post('/me/avatar', auth, upload.single('avatar'), uploadAvatar);
router.patch('/me/change-password', auth, changePassword);
router.delete('/me', auth, deleteAccount);
router.get('/:userId', auth, getUserProfile); 
router.post('/:userId/connect', auth, sendConnectionRequest);
router.get('/:userId/connection-status', auth, getConnectionStatus);

export default router;