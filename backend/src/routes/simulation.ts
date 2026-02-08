import { Router } from 'express';
import { simulateCode } from '../controllers/simulationController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.post('/run', optionalAuth, simulateCode);

export default router;
