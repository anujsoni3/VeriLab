import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import { errorHandler, logger } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

// Import routes
import authRoutes from './routes/auth.js';
import problemRoutes from './routes/problems.js';
import submissionRoutes from './routes/submissions.js';
import simulationRoutes from './routes/simulation.js';
import { getLeaderboard } from './routes/leaderboard.js';
import { getQuizzes, getQuizById, submitQuiz } from './routes/quizzes.js';
import { getUserProfile, updateUserProfile } from './controllers/userController.js';
import { authMiddleware } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/simulation', simulationRoutes);
app.get('/api/leaderboard', getLeaderboard);
app.get('/api/quizzes', getQuizzes);
app.get('/api/quizzes/:id', getQuizById);
app.post('/api/quizzes/:id/submit', authMiddleware, submitQuiz);
app.get('/api/users/:userId', getUserProfile);
app.put('/api/users/:userId', authMiddleware, updateUserProfile);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Connect to database and start server
const startServer = async () => {
    try {
        await connectDatabase();

        app.listen(PORT, () => {
            logger.info(`🚀 Server running on port ${PORT}`);
            logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
