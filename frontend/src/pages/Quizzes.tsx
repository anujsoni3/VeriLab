import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Quiz {
    id: string;
    title: string;
    category: string;
    difficulty: string;
    chapter: string;
    stage: number;
    duration: number;
    questionCount: number;
}

const Quizzes: React.FC = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const response = await api.get('/quizzes');
            if (response.data.success) {
                setQuizzes(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load quizzes');
        } finally {
            setLoading(false);
        }
    };

    // Group quizzes by chapter
    const quizzesByChapter = quizzes.reduce((acc, quiz) => {
        const chapter = quiz.chapter || 'General';
        if (!acc[chapter]) {
            acc[chapter] = [];
        }
        acc[chapter].push(quiz);
        return acc;
    }, {} as Record<string, Quiz[]>);

    // Sort chapters and stages
    const sortedChapters = Object.keys(quizzesByChapter).sort();
    sortedChapters.forEach(chapter => {
        quizzesByChapter[chapter].sort((a, b) => a.stage - b.stage);
    });

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'easy': return 'text-success bg-success/10 border-success/20';
            case 'medium': return 'text-warning bg-warning/10 border-warning/20';
            case 'hard': return 'text-error bg-error/10 border-error/20';
            default: return 'text-text-muted bg-surface-active border-border';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-text-primary mb-2">Quizzes</h1>
                    <p className="text-text-secondary">Master Digital Electronics & Verilog through staged challenges</p>
                </div>
                <Link
                    to="/dashboard"
                    className="px-4 py-2 bg-surface hover:bg-surface-hover border border-border rounded-lg text-text-primary transition-all"
                >
                    Back to Dashboard
                </Link>
            </div>

            {Object.keys(quizzesByChapter).length === 0 ? (
                <div className="bg-surface p-8 rounded-2xl text-center border border-border">
                    <p className="text-text-muted">No quizzes available yet</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {sortedChapters.map((chapter) => (
                        <div key={chapter} className="animate-slideUp">
                            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-primary rounded-full"></span>
                                {chapter}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {quizzesByChapter[chapter].map((quiz, index) => (
                                    <Link
                                        key={quiz.id}
                                        to={`/quizzes/${quiz.id}`}
                                        className="group bg-surface hover:bg-surface-hover border border-border p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 relative overflow-hidden"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <span className="text-6xl font-bold text-primary">{quiz.stage}</span>
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                                    Stage {quiz.stage}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(quiz.difficulty)}`}>
                                                    {quiz.difficulty.toUpperCase()}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2 min-h-[3.5rem]">
                                                {quiz.title}
                                            </h3>

                                            <div className="flex items-center gap-4 text-sm text-text-secondary mb-6">
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {quiz.questionCount} Qs
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {quiz.duration / 60}m
                                                </div>
                                            </div>

                                            <button className="w-full py-2.5 bg-background hover:bg-primary hover:text-white text-text-primary border border-border hover:border-primary rounded-xl font-medium transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-primary/20">
                                                Start Challenge
                                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Quizzes;
