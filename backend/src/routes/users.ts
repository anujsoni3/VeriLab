import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/:userId', optionalAuth, getUserProfile);
router.put('/:userId', authMiddleware, updateUserProfile);

export default router;
