import { Request, Response } from 'express';
import Subject from '../models/Subject.js';
import Chapter from '../models/Chapter.js';
import Stage from '../models/Stage.js';
import User from '../models/User.js';

// Get all subjects
export const getSubjects = async (req: Request, res: Response) => {
    try {
        const subjects = await Subject.find({ isPublished: true }).sort('order');
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subjects', error });
    }
};

// Get single subject with chapters
export const getSubjectById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const subject = await Subject.findById(id);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        const chapters = await Chapter.find({ subjectId: id, isPublished: true }).sort('order');
        res.json({ subject, chapters });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subject details', error });
    }
};

// Get specific chapter details with stages (metadata only)
export const getChapterDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const chapter = await Chapter.findById(id);
        if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

        const stages = await Stage.find({ chapterId: id })
            .select('title type order isMandatory xpPoints') // Exclude heavy content
            .sort('order');

        res.json({ chapter, stages });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chapter details', error });
    }
};

// Get specific stage content
export const getStageContent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const stage = await Stage.findById(id)
            .populate('problemId')
            .populate('quizId');

        if (!stage) return res.status(404).json({ message: 'Stage not found' });
        res.json(stage);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stage content', error });
    }
};

// Update user progress (mark stage as complete)
export const updateProgress = async (req: Request | any, res: Response) => {
    try {
        const { stageId } = req.body;
        const userId = req.user?.id; // Assuming auth middleware adds user to req

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const stage = await Stage.findById(stageId);
        if (!stage) return res.status(404).json({ message: 'Stage not found' });

        // Logic to update user's progress would go here.
        // For now, we'll just mock it or if User model supports it, update it.
        // This requires a Progress model or field in User.

        // Detailed implementation of progress tracking to be added.

        res.json({ message: 'Progress updated', xpEarned: stage.xpPoints });
    } catch (error) {
        res.status(500).json({ message: 'Error updating progress', error });
    }
};
