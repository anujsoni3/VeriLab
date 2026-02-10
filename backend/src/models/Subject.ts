import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
    title: string;
    slug: string;
    description: string;
    icon: string; // URL or icon name
    totalChapters: number;
    estimatedHours: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    order: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SubjectSchema: Schema = new Schema({
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    totalChapters: { type: Number, default: 0 },
    estimatedHours: { type: Number, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<ISubject>('Subject', SubjectSchema);
