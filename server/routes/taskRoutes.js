import express from 'express';
import { createTask, getTasksForProject, updateTaskStatus  } from '../controllers/taskController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.get('/', auth, getTasksForProject);
router.post('/', auth, createTask);
router.patch('/:taskId', auth, updateTaskStatus);

export default router;