import { Request, Response } from 'express';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import { validateObjectId } from '../utils/validation.js';

export const getQuizzes = async (req: Request, res: Response): Promise<void> => {
    try {
        const quizzes = await Quiz.find().sort({ createdAt: -1 });

        const quizzesData = quizzes.map(quiz => ({
            id: quiz._id.toString(),
            title: quiz.title,
            category: quiz.category,
            difficulty: quiz.difficulty,
            duration: quiz.duration,
            questionCount: quiz.questions?.length || 0,
            createdAt: quiz.createdAt,
        }));

        res.json({ success: true, data: quizzesData });
    } catch (error) {
        console.error('Get quizzes error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const getQuizById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!validateObjectId(id, res, 'Quiz')) {
            return;
        }

        const quiz = await Quiz.findById(id);

        if (!quiz) {
            res.status(404).json({ success: false, error: 'Quiz not found' });
            return;
        }

        res.json({ success: true, data: quiz });
    } catch (error) {
        console.error('Get quiz error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const submitQuiz = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, error: 'Not authenticated' });
            return;
        }

        const { id } = req.params;
        const { answers } = req.body;

        if (!validateObjectId(id, res, 'Quiz')) {
            return;
        }

        if (!answers || !Array.isArray(answers)) {
            res.status(400).json({ success: false, error: 'Invalid answers format' });
            return;
        }

        const quiz = await Quiz.findById(id);

        if (!quiz) {
            res.status(404).json({ success: false, error: 'Quiz not found' });
            return;
        }

        const questions = quiz.questions;

        // Calculate score
        let score = 0;
        questions.forEach((question: any, index: number) => {
            const userAnswer = answers[index] || [];
            const correctAnswers = question.correctAnswers;

            // Check if arrays are equal
            const isCorrect =
                userAnswer.length === correctAnswers.length &&
                userAnswer.every((ans: number) => correctAnswers.includes(ans));

            if (isCorrect) {
                score += question.points;
            }
        });

        const totalPoints = questions.reduce((sum: number, q: any) => sum + q.points, 0);
        const percentage = (score / totalPoints) * 100;

        // Save attempt
        const attempt = await QuizAttempt.create({
            userId: req.user.uid,
            quizId: id,
            answers,
            score,
            percentage,
        });

        res.json({
            success: true,
            data: {
                id: attempt._id.toString(),
                score,
                percentage,
                totalPoints,
            },
        });
    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
