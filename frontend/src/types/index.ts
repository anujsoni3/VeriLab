// User types
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

// Problem types
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

// Submission types
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
    output?: string;
    timestamp: Date;
}

// Quiz types
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

// Leaderboard types
export interface LeaderboardEntry {
    rank: number;
    uid: string;
    displayName: string;
    username: string;
    totalPoints: number;
    solvedProblems: number;
}

// Auth types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupData {
    email: string;
    password: string;
    displayName: string;
    username: string;
    college: string;
    branch: string;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// Component prop types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

export interface BadgeProps {
    children: React.ReactNode;
    variant?: 'easy' | 'medium' | 'hard' | 'success' | 'error' | 'info';
    pulse?: boolean;
}
