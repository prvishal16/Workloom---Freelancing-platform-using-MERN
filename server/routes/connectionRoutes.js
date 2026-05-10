import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { 
  getPendingRequests, 
  respondToRequest,
  getMyConnections 
} from '../controllers/connectionController.js';

const router = express.Router();

router.get('/', auth, getMyConnections);
router.get('/pending', auth, getPendingRequests);
router.patch('/:connectionId', auth, respondToRequest);

export default router;