import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    displayName: string;
    username: string;
    avatar: string | null;
    college: string;
    branch: string;
    solvedProblems: string[];
    totalPoints: number;
    rank: number;
    googleId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: function (this: IUser) {
                return !this.googleId;
            },
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        displayName: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        avatar: {
            type: String,
            default: null,
        },
        college: {
            type: String,
            required: false,
            default: "Not Specified"
        },
        branch: {
            type: String,
            required: false,
            default: "Not Specified"
        },
        solvedProblems: {
            type: [String],
            default: [],
        },
        totalPoints: {
            type: Number,
            default: 0,
        },
        rank: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IUser>('User', UserSchema);
