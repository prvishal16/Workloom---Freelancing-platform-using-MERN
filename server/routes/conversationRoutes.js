import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { 
  startConversation, 
  getConversations, 
  getMessagesForConversation,
  sendMessage 
} from '../controllers/conversationController.js';

const router = express.Router();
router.get('/', auth, getConversations);
router.post('/', auth, startConversation);
router.get('/:conversationId/messages', auth, getMessagesForConversation);
router.post('/:conversationId/messages', auth, sendMessage); 

export default router;