import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { createReview, checkUserReview  } from '../controllers/reviewController.js';

const router = express.Router({ mergeParams: true });
router.post('/', auth, createReview);
router.get('/me', auth, checkUserReview);

export default router;
