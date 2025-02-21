import { Router } from 'express';
import { createTask, getUserTasks } from '../controllers/tasksController';
import { verifyToken } from '../middlewares/authMiddleware'; // if you have JWT auth

const router = Router();

// Protect routes with verifyToken if tasks are user-specific
router.post('/', verifyToken, createTask);
router.get('/', verifyToken, getUserTasks);

export default router;
