import { Request, Response } from 'express';
import Contest from '../models/Contest.js';
import ContestParticipant from '../models/ContestParticipant.js';
import User from '../models/User.js';
import { io } from '../server.js'; // Import io instance

// Create a new contest
export const createContest = async (req: Request, res: Response) => {
    try {
        const { title, description, startTime, endTime, problems } = req.body;

        // Basic validation
        if (!title || !description || !startTime || !endTime || !problems) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }

        const contest = await Contest.create({
            title,
            description,
            startTime,
            endTime,
            problems,
            createdBy: req.user!.uid
        });

        res.status(201).json({ success: true, data: contest });
    } catch (error) {
        console.error('Create contest error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Get all contests
export const getContests = async (req: Request, res: Response) => {
    try {
        const contests = await Contest.find().sort({ startTime: -1 });
        res.json({ success: true, data: contests });
    } catch (error) {
        console.error('Get contests error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Get contest details
export const getContestById = async (req: Request, res: Response) => {
    try {
        const contest = await Contest.findById(req.params.id)
            .populate('problems.problemId', 'title slug difficulty') // Only expose minimal problem details if needed
            .populate('createdBy', 'displayName');

        if (!contest) {
            return res.status(404).json({ success: false, error: 'Contest not found' });
        }

        res.json({ success: true, data: contest });
    } catch (error) {
        console.error('Get contest error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Register for contest
export const registerForContest = async (req: Request, res: Response) => {
    try {
        const contestId = req.params.id;
        const userId = req.user!.uid;

        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({ success: false, error: 'Contest not found' });
        }

        // Check if already registered
        const existingParticipant = await ContestParticipant.findOne({ contestId, userId });
        if (existingParticipant) {
            return res.status(400).json({ success: false, error: 'Already registered' });
        }

        await ContestParticipant.create({ contestId, userId });

        // Add user to contest participants array (schema modification might be needed if we want bidirectional)
        // For now, ContestParticipant is the source of truth

        res.json({ success: true, message: 'Registered successfully' });
    } catch (error) {
        console.error('Register contest error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Get Leaderboard
export const getContestLeaderboard = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const participants = await ContestParticipant.find({ contestId: id })
            .populate('userId', 'displayName username avatar')
            .sort({ score: -1, finishTime: 1 }); // Higher score first, then earlier finish time

        res.json({ success: true, data: participants });
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Get My Participation
export const getMyContestParticipation = async (req: Request, res: Response) => {
    try {
        const contestId = req.params.id;
        const userId = req.user!.uid;

        const participant = await ContestParticipant.findOne({ contestId, userId });

        if (!participant) {
            return res.status(404).json({ success: false, error: 'Not participating' });
        }

        res.json({ success: true, data: participant });
    } catch (error) {
        console.error('Get participation error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
