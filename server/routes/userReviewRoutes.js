import express from 'express';
import { getReviewsForUser } from '../controllers/reviewController.js';

const router = express.Router({ mergeParams: true });
router.get('/', getReviewsForUser);

export default router;