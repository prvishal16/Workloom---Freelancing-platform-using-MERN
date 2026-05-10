import express from 'express';
import { getDeliverablesForProject, uploadDeliverable } from '../controllers/deliverableController.js';
import auth from '../middleware/authMiddleware.js';
import upload from '../config/cloudinary.js';

const router = express.Router({ mergeParams: true });

router.get('/', auth, getDeliverablesForProject);
router.post('/', auth, upload.single('deliverable'), uploadDeliverable);

export default router;