import { Request, Response } from 'express';
import User from '../models/User.js';

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find()
            .sort({ totalPoints: -1 })
            .limit(10)
            .select('-password');

        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            uid: user._id.toString(),
            displayName: user.displayName,
            username: user.username,
            totalPoints: user.totalPoints || 0,
            solvedProblems: user.solvedProblems?.length || 0,
        }));

        res.json({ success: true, data: leaderboard });
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
