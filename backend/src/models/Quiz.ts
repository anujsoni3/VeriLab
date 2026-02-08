import mongoose, { Schema, Document } from 'mongoose';

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswers: number[];
    explanation: string;
    points: number;
}

export interface IQuiz extends Document {
    title: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    chapter: string;
    stage: number;
    duration: number;
    questions: QuizQuestion[];
    createdAt: Date;
}

const QuizSchema = new Schema<IQuiz>(
    {
        title: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            required: true,
        },
        chapter: {
            type: String,
            required: true, // Making it required for new quizzes
            default: 'General', // Fallback for existing
        },
        stage: {
            type: Number,
            required: true,
            default: 1,
        },
        duration: {
            type: Number,
            required: true,
        },
        questions: [
            {
                id: String,
                question: String,
                options: [String],
                correctAnswers: [Number],
                explanation: String,
                points: Number,
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
