import { Request, Response } from 'express';
import Problem from '../models/Problem.js';
import { validateObjectId } from '../utils/validation.js';

export const getProblems = async (req: Request, res: Response): Promise<void> => {
    try {
        const { difficulty, search } = req.query;

        let query: any = {};

        if (difficulty && difficulty !== 'all') {
            query.difficulty = difficulty;
        }

        if (search && typeof search === 'string') {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const problems = await Problem.find(query).sort({ createdAt: -1 });

        const mappedProblems = problems.map(problem => ({
            ...problem.toObject(),
            id: problem._id,
        }));

        res.json({ success: true, data: mappedProblems });
    } catch (error) {
        console.error('Get problems error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const getProblemById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!validateObjectId(id, res, 'Problem')) {
            return;
        }

        const problem = await Problem.findById(id);

        if (!problem) {
            res.status(404).json({ success: false, error: 'Problem not found' });
            return;
        }

        res.json({
            success: true,
            data: { ...problem.toObject(), id: problem._id }
        });
    } catch (error) {
        console.error('Get problem error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const createProblem = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            title,
            slug,
            description,
            difficulty,
            category,
            tags,
            points,
            templateCode,
        } = req.body;

        if (!title || !slug || !description || !difficulty || !category || !points || !templateCode) {
            res.status(400).json({ success: false, error: 'Missing required fields' });
            return;
        }

        const problem = await Problem.create({
            title,
            slug,
            description,
            difficulty,
            category,
            tags: tags || [],
            points,
            templateCode,
            totalAttempts: 0,
            totalSolved: 0,
        });

        res.status(201).json({
            success: true,
            data: {
                id: problem._id.toString(),
                message: 'Problem created successfully',
            },
        });
    } catch (error) {
        console.error('Create problem error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
