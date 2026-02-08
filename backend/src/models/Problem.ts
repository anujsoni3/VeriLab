import mongoose, { Schema, Document } from 'mongoose';

export interface IProblem extends Document {
    title: string;
    slug: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    tags: string[];
    points: number;
    templateCode: string;
    testbench: string;
    totalAttempts: number;
    totalSolved: number;
    createdAt: Date;
}

const ProblemSchema = new Schema<IProblem>(
    {
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        points: {
            type: Number,
            required: true,
        },
        templateCode: {
            type: String,
            required: true,
        },
        totalAttempts: {
            type: Number,
            default: 0,
        },
        totalSolved: {
            type: Number,
            default: 0,
        },
        testbench: {
            type: String,
            required: true,
            default: '', // Added default to avoid breaking existing documents immediately, though required: true generally enforces presence on save
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IProblem>('Problem', ProblemSchema);
