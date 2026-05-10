import express from 'express';
import { addComment, createPost, getAllPosts, likePost } from '../controllers/postController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', auth, createPost);
router.get('/', auth, getAllPosts);
router.post('/:postId/like', auth, likePost);
router.post('/:postId/comment', auth, addComment);

export default router;