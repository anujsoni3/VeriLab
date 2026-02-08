import { Request, Response } from 'express';
import User from '../models/User.js';
import { validateObjectId } from '../utils/validation.js';

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        if (!validateObjectId(userId, res, 'User')) {
            return;
        }

        const user = await User.findById(userId).select('-password');

        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }

        res.json({
            success: true,
            data: {
                uid: user._id.toString(),
                email: user.email,
                displayName: user.displayName,
                username: user.username,
                college: user.college,
                branch: user.branch,
                avatar: user.avatar,
                solvedProblems: user.solvedProblems,
                totalPoints: user.totalPoints,
                rank: user.rank,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, error: 'Not authenticated' });
            return;
        }

        const { userId } = req.params;

        if (!validateObjectId(userId, res, 'User')) {
            return;
        }

        // Users can only update their own profile
        if (req.user.uid !== userId) {
            res.status(403).json({ success: false, error: 'Forbidden' });
            return;
        }

        const { displayName, college, branch } = req.body;

        const updateData: any = {};

        if (displayName) updateData.displayName = displayName;
        if (college) updateData.college = college;
        if (branch) updateData.branch = branch;

        await User.findByIdAndUpdate(userId, updateData);

        res.json({
            success: true,
            data: { message: 'Profile updated successfully' },
        });
    } catch (error) {
        console.error('Update user profile error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
