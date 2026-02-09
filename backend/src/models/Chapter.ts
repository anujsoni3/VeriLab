import mongoose, { Schema, Document } from 'mongoose';

export interface IChapter extends Document {
    title: string;
    slug: string; // e.g., 'logic-gates'
    description: string;
    subjectId: mongoose.Types.ObjectId;
    order: number; // 1, 2, 3...
    estimatedMinutes: number;
    learningOutcomes: string[]; // Bullet points
    totalStages: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ChapterSchema: Schema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    order: { type: Number, required: true },
    estimatedMinutes: { type: Number, required: true },
    learningOutcomes: [{ type: String }],
    totalStages: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
}, { timestamps: true });

// Compound index to ensure unique slugs per subject, or globally unique slugs
ChapterSchema.index({ slug: 1, subjectId: 1 }, { unique: true });

export default mongoose.model<IChapter>('Chapter', ChapterSchema);
