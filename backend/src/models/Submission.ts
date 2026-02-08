import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
    userId: mongoose.Types.ObjectId;
    problemId: mongoose.Types.ObjectId;
    code: string;
    status: 'pending' | 'accepted' | 'rejected';
    reviewedBy: mongoose.Types.ObjectId | null;
    reviewNotes: string | null;
    pointsEarned: number;
    output?: string;
    timestamp: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        problemId: {
            type: Schema.Types.ObjectId,
            ref: 'Problem',
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
        },
        reviewedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        reviewNotes: {
            type: String,
            default: null,
        },
        pointsEarned: {
            type: Number,
            default: 0,
        },
        output: {
            type: String,
            default: '',
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: false,
    }
);

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);
