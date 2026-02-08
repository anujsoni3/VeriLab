export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const DIFFICULTY_COLORS = {
    easy: 'text-green-400 bg-green-400/10 border-green-400/20',
    medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    hard: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export const STATUS_COLORS = {
    pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    accepted: 'text-green-400 bg-green-400/10 border-green-400/20',
    rejected: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    DASHBOARD: '/dashboard',
    PROBLEMS: '/problems',
    PROBLEM_DETAIL: '/problems/:id',
    LEADERBOARD: '/leaderboard',
    QUIZZES: '/quizzes',
    QUIZ_DETAIL: '/quizzes/:id',
    PROFILE: '/profile',
    ADMIN: '/admin',
};
