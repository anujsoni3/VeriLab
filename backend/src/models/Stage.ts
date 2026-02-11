import mongoose, { Schema, Document } from 'mongoose';

export type StageType = 'theory' | 'practice' | 'quiz' | 'problem' | 'simulation';

export interface IStage extends Document {
    title: string;
    type: StageType;
    chapterId: mongoose.Types.ObjectId;
    order: number; // 1, 2, 3...
    content?: string; // Markdown content for 'theory'
    codeSnippet?: string; // For theory/practice
    problemId?: mongoose.Types.ObjectId; // For 'problem' type (links to Problem model)
    quizId?: mongoose.Types.ObjectId; // For 'quiz' type (links to Quiz model)
    isMandatory: boolean;
    xpPoints: number;
    createdAt: Date;
    simulationConfig?: {
        type: 'logic-gate' | 'combinational';
        defaultProps?: any;
    };
    testbench?: string; // For practice/problem stages directly defined
    updatedAt: Date;
}

const StageSchema: Schema = new Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['theory', 'practice', 'quiz', 'problem', 'simulation'], required: true },
    chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter', required: true },
    order: { type: Number, required: true },
    content: { type: String }, // Markdown for theory
    codeSnippet: { type: String }, // Example code or starter code
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem' },
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz' },
    isMandatory: { type: Boolean, default: true },
    xpPoints: { type: Number, default: 10 },
    simulationConfig: {
        type: { type: String, enum: ['logic-gate', 'combinational'] },
        defaultProps: { type: Object }
    },
    testbench: { type: String },
}, { timestamps: true });

StageSchema.index({ chapterId: 1, order: 1 }, { unique: true });

export default mongoose.model<IStage>('Stage', StageSchema);
