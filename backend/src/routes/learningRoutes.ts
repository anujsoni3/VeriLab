import express from 'express';
import {
    getSubjects,
    getSubjectById,
    getChapterDetails,
    getStageContent,
    updateProgress
} from '../controllers/learningController.js';
import { authMiddleware as protect } from '../middleware/auth.js'; // Assuming this exists

const router = express.Router();

router.get('/subjects', getSubjects);
router.get('/subjects/:id', getSubjectById);
router.get('/chapters/:id', protect, getChapterDetails);
router.get('/stages/:id', protect, getStageContent);
router.post('/progress', protect, updateProgress);

export default router;
