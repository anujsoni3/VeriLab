import { Router } from 'express';
import { submitCode, getUserSubmissions, reviewSubmission } from '../controllers/submissionController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/submit', authMiddleware, submitCode);
router.get('/user/:userId', authMiddleware, getUserSubmissions);
router.put('/:id/review', authMiddleware, reviewSubmission); // Admin only

export default router;
