import express from 'express';
import { getMyProposals, updateProposalStatus } from '../controllers/proposalController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();
router.patch('/:proposalId', auth, updateProposalStatus);
router.get('/my', auth, getMyProposals);

export default router;