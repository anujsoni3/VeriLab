import { Router } from 'express';
import {
    createContest,
    getContests,
    getContestById,
    registerForContest,
    getContestLeaderboard
} from '../controllers/contestController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, createContest);
router.get('/', getContests);
router.get('/:id', getContestById);
router.post('/:id/register', authMiddleware, registerForContest);
router.get('/:id/leaderboard', getContestLeaderboard);

export default router;
