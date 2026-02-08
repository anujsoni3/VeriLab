import mongoose, { Schema, Document } from 'mongoose';

export interface IContestParticipant extends Document {
    contestId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    score: number;
    finishTime: Date | null; // Time of last score increase
    submissions: Map<string, {
        status: 'pending' | 'accepted' | 'rejected';
        attempts: number;
        solvedAt: Date | null;
    }>;
}

const ContestParticipantSchema = new Schema<IContestParticipant>(
    {
        contestId: {
            type: Schema.Types.ObjectId,
            ref: 'Contest',
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        score: {
            type: Number,
            default: 0,
        },
        finishTime: {
            type: Date,
            default: null,
        },
        submissions: {
            type: Map,
            of: new Schema({
                status: {
                    type: String,
                    enum: ['pending', 'accepted', 'rejected'],
                    default: 'pending',
                },
                attempts: {
                    type: Number,
                    default: 0,
                },
                solvedAt: {
                    type: Date,
                    default: null,
                },
            }, { _id: false }),
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure a user can only participate once per contest
ContestParticipantSchema.index({ contestId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IContestParticipant>('ContestParticipant', ContestParticipantSchema);
