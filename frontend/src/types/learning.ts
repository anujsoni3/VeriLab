export interface Subject {
    _id: string;
    title: string;
    slug: string;
    description: string;
    icon: string;
    totalChapters: number;
    estimatedHours: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    isPublished: boolean;
    progress?: number; // For UI
}

export interface Chapter {
    _id: string;
    title: string;
    slug: string;
    description: string;
    subjectId: string;
    order: number;
    estimatedMinutes: number;
    learningOutcomes: string[];
    totalStages: number;
    isPublished: boolean;
    isLocked?: boolean; // For UI
    status?: 'not-started' | 'in-progress' | 'completed'; // For UI
}

export interface Stage {
    _id: string;
    title: string;
    type: 'theory' | 'practice' | 'quiz' | 'problem';
    chapterId: string;
    order: number;
    content?: string;
    codeSnippet?: string;
    problemId?: any; // Start precise, expand later
    quizId?: any;
    isMandatory: boolean;
    xpPoints: number;
    isCompleted?: boolean; // For UI
    isLocked?: boolean; // For UI
}
