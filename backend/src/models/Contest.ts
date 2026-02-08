import mongoose, { Schema, Document } from 'mongoose';

export interface IContest extends Document {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    problems: {
        problemId: mongoose.Types.ObjectId;
        points: number;
    }[];
    participants: mongoose.Types.ObjectId[];
    createdBy: mongoose.Types.ObjectId;
    status: 'upcoming' | 'active' | 'ended';
    createdAt: Date;
}

const ContestSchema = new Schema<IContest>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        problems: [
            {
                problemId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Problem',
                    required: true,
                },
                points: {
                    type: Number,
                    required: true,
                },
            },
        ],
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['upcoming', 'active', 'ended'],
            default: 'upcoming',
        },
    },
    {
        timestamps: true,
    }
);

// Auto-update status based on time? 
// For now, we'll handle status updates via scheduled jobs or on-read.
// A virtual property for 'status' might be better if we want it purely time-based,
// but storing it allows manual termination.

export default mongoose.model<IContest>('Contest', ContestSchema);
