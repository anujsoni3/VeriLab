import { Router } from 'express';
import { getProblems, getProblemById, createProblem } from '../controllers/problemController.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getProblems);
router.get('/:id', optionalAuth, getProblemById);
router.post('/', authMiddleware, createProblem); // Admin only in production

export default router;
