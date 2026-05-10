import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { addExperience, getExperienceForUser, deleteExperience } from '../controllers/experienceController.js';

const router = express.Router();

router.post('/', auth, addExperience);
router.get('/user/:userId', getExperienceForUser);
router.delete('/:id', auth, deleteExperience);

export default router;