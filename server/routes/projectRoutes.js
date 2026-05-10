import express from 'express';
import { createProject, getOpenProjects, getProjectById, getMyProjects } from '../controllers/projectController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', getOpenProjects); 
router.post('/', auth, createProject);
router.get('/my', auth, getMyProjects);
router.get('/:id', getProjectById);


export default router;