// Backend types
export interface User {
    uid: string;
    email: string;
    displayName: string;
    username: string;
    avatar: string | null;
    college: string;
    branch: string;
    solvedProblems: string[];
    totalPoints: number;
    rank: number;
    createdAt: Date;
    updatedAt: Date;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Problem {
    id: string;
    title: string;
    slug: string;
    description: string;
    difficulty: Difficulty;
    category: string;
    tags: string[];
    points: number;
    templateCode: string;
    totalAttempts: number;
    totalSolved: number;
    createdAt: Date;
}

export type SubmissionStatus = 'pending' | 'accepted' | 'rejected';

export interface Submission {
    id: string;
    userId: string;
    problemId: string;
    code: string;
    status: SubmissionStatus;
    reviewedBy: string | null;
    reviewNotes: string | null;
    pointsEarned: number;
    timestamp: Date;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswers: number[];
    explanation: string;
    points: number;
}

export interface Quiz {
    id: string;
    title: string;
    category: string;
    difficulty: Difficulty;
    duration: number;
    questions: QuizQuestion[];
    createdAt: Date;
}

export interface QuizAttempt {
    id: string;
    userId: string;
    quizId: string;
    answers: number[][];
    score: number;
    percentage: number;
    completedAt: Date;
}

// JWT Payload
export interface JWTPayload {
    uid: string;
    email: string;
}

// Request extensions
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}
