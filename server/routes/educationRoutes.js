import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { addEducation, getEducationForUser, deleteEducation } from '../controllers/educationController.js';

const router = express.Router();

router.post('/', auth, addEducation);
router.get('/user/:userId', getEducationForUser);
router.delete('/:id', auth, deleteEducation);

export default router;