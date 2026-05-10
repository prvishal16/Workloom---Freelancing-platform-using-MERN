import express from 'express';
import { submitProposal, getProposalsForProject  } from '../controllers/proposalController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.get('/', auth, getProposalsForProject);
router.post('/', auth, submitProposal);

export default router;