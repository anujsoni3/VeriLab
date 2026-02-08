import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizAttempt extends Document {
    userId: mongoose.Types.ObjectId;
    quizId: mongoose.Types.ObjectId;
    answers: number[][];
    score: number;
    percentage: number;
    completedAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        quizId: {
            type: Schema.Types.ObjectId,
            ref: 'Quiz',
            required: true,
        },
        answers: {
            type: [[Number]],
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        percentage: {
            type: Number,
            required: true,
        },
        completedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: false,
    }
);

export default mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
