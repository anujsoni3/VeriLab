import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Quiz } from '../types';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

const QuizDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [started, setStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[][]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState<any>(null);

    useEffect(() => {
        if (id) {
            fetchQuiz();
        }
    }, [id]);

    useEffect(() => {
        if (started && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [started, timeLeft]);

    const fetchQuiz = async () => {
        try {
            const response = await api.get(`/quizzes/${id}`);
            if (response.data.success) {
                setQuiz(response.data.data);
                setAnswers(new Array(response.data.data.questions.length).fill([]));
            }
        } catch (error) {
            toast.error('Failed to load quiz');
        } finally {
            setLoading(false);
        }
    };

    const startQuiz = () => {
        if (quiz) {
            setStarted(true);
            setTimeLeft(quiz.duration * 60);
        }
    };

    const handleAnswerSelect = (optionIndex: number) => {
        const newAnswers = [...answers];
        const currentAnswers = newAnswers[currentQuestion] || [];

        if (currentAnswers.includes(optionIndex)) {
            newAnswers[currentQuestion] = currentAnswers.filter(a => a !== optionIndex);
        } else {
            newAnswers[currentQuestion] = [...currentAnswers, optionIndex];
        }

        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (quiz && currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await api.post(`/quizzes/${id}/submit`, { answers });
            if (response.data.success) {
                const resultData = response.data.data;
                setResults(resultData);
                setShowResults(true);
                toast.success('Quiz submitted!');

                if (resultData.percentage >= 70) {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
            }
        } catch (error) {
            toast.error('Failed to submit quiz');
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimerColor = () => {
        if (timeLeft > 300) return 'text-green-400';
        if (timeLeft > 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    if (loading) {
        return (
            <div className="min-h-screen animated-gradient flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="min-h-screen animated-gradient flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Quiz not found</h2>
                    <button onClick={() => navigate('/quizzes')} className="text-primary hover:text-primary-light">
                        Back to Quizzes
                    </button>
                </div>
            </div>
        );
    }

    if (showResults && results) {
        const isSuccess = results.percentage >= 70;
        return (
            <div className="min-h-screen p-8 flex items-center justify-center">
                <div className="max-w-md w-full animate-slideUp">
                    <div className="bg-surface border border-border p-8 rounded-2xl text-center shadow-2xl">
                        <div className="text-6xl mb-6">
                            {isSuccess ? '🎉' : '💪'}
                        </div>
                        <h2 className="text-3xl font-bold mb-2 text-text-primary">
                            {isSuccess ? 'Excellent Work!' : 'Keep Practicing!'}
                        </h2>
                        <p className="text-text-secondary mb-8">
                            {isSuccess
                                ? "You've mastered this stage. Ready for the next challenge?"
                                : "Don't give up. Review the material and try again."}
                        </p>

                        <div className="bg-background p-6 rounded-xl mb-8 border border-border">
                            <div className="text-sm text-text-muted uppercase tracking-wider mb-1">Your Score</div>
                            <div className={`text-5xl font-bold ${isSuccess ? 'text-success' : 'text-warning'} mb-2`}>
                                {results.percentage.toFixed(0)}%
                            </div>
                            <div className="text-sm text-text-secondary">
                                {results.score} / {results.totalPoints} points
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/quizzes')}
                                className="flex-1 py-3 px-4 bg-surface hover:bg-surface-hover border border-border rounded-xl font-medium text-text-primary transition-all"
                            >
                                All Quizzes
                            </button>
                            <button
                                onClick={() => {
                                    setStarted(false);
                                    setShowResults(false);
                                    setAnswers([]);
                                    setCurrentQuestion(0);
                                }}
                                className="flex-1 py-3 px-4 bg-primary hover:bg-primary-light text-white rounded-xl font-medium transition-all shadow-lg shadow-primary/20"
                            >
                                Retry Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!started) {
        return (
            <div className="min-h-screen animated-gradient p-8">
                <div className="max-w-2xl mx-auto">
                    <div className="glass-strong p-8 rounded-2xl">
                        <h1 className="text-3xl font-bold mb-4 gradient-text">{quiz.title}</h1>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center p-4 glass rounded-lg">
                                <span className="text-gray-400">Category</span>
                                <span className="font-semibold">{quiz.category}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 glass rounded-lg">
                                <span className="text-gray-400">Questions</span>
                                <span className="font-semibold">{quiz.questions.length}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 glass rounded-lg">
                                <span className="text-gray-400">Duration</span>
                                <span className="font-semibold">{quiz.duration} minutes</span>
                            </div>
                            <div className="flex justify-between items-center p-4 glass rounded-lg">
                                <span className="text-gray-400">Difficulty</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${quiz.difficulty === 'easy' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                                    quiz.difficulty === 'medium' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                                        'text-red-400 bg-red-400/10 border-red-400/20'
                                    }`}>
                                    {quiz.difficulty.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={startQuiz}
                            className="w-full py-3 bg-primary hover:bg-primary-light rounded-lg font-semibold transition-all glow-primary"
                        >
                            Start Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const question = quiz.questions[currentQuestion];

    return (
        <div className="min-h-screen animated-gradient p-8">
            <div className="max-w-3xl mx-auto">
                {/* Timer */}
                <div className="glass-strong p-4 rounded-2xl mb-4 flex justify-between items-center">
                    <div>
                        <span className="text-gray-400">Question {currentQuestion + 1} of {quiz.questions.length}</span>
                    </div>
                    <div className={`text-2xl font-bold ${getTimerColor()}`}>
                        ⏱️ {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Question */}
                <div className="glass-strong p-8 rounded-2xl mb-4">
                    <h2 className="text-2xl font-semibold mb-6">{question.question}</h2>
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                className={`w-full p-4 rounded-lg text-left transition-all ${answers[currentQuestion]?.includes(index)
                                    ? 'bg-primary/20 border-2 border-primary'
                                    : 'glass hover:glass-strong border-2 border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[currentQuestion]?.includes(index)
                                        ? 'border-primary bg-primary'
                                        : 'border-gray-400'
                                        }`}>
                                        {answers[currentQuestion]?.includes(index) && (
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <span>{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className="px-6 py-3 glass hover:glass-strong rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    {currentQuestion === quiz.questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-3 bg-primary hover:bg-primary-light rounded-lg font-semibold transition-all glow-primary"
                        >
                            Submit Quiz
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-6 py-3 bg-primary hover:bg-primary-light rounded-lg font-semibold transition-all"
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizDetail;
