import express from 'express';
import { searchAll } from '../controllers/searchController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', auth, searchAll);

export default router;