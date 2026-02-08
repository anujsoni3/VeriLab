import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Problem, Difficulty } from '../types';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const Problems: React.FC = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [difficulty, setDifficulty] = useState<string>('all');
    const [search, setSearch] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchProblems();
    }, []);

    useEffect(() => {
        filterProblems();
    }, [problems, difficulty, search]);

    const fetchProblems = async () => {
        try {
            const response = await api.get('/problems');
            if (response.data.success) {
                setProblems(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load problems');
        } finally {
            setLoading(false);
        }
    };

    const filterProblems = () => {
        let filtered = problems;

        if (difficulty !== 'all') {
            filtered = filtered.filter(p => p.difficulty === difficulty);
        }

        if (search) {
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredProblems(filtered);
    };

    const getDifficultyColor = (diff: Difficulty) => {
        switch (diff) {
            case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
        }
    };

    const isSolved = (problemId: string) => {
        return user?.solvedProblems?.includes(problemId);
    };

    if (loading) {
        return (
            <div className="min-h-screen animated-gradient flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen animated-gradient p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold gradient-text">Problems</h1>
                    <Link
                        to="/dashboard"
                        className="px-4 py-2 glass hover:glass-strong rounded-lg transition-all"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {/* Filters */}
                <div className="glass-strong p-6 rounded-2xl mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Search</label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search problems..."
                                className="w-full px-4 py-2 bg-dark-lighter border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Difficulty</label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full px-4 py-2 bg-dark-lighter border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                            >
                                <option value="all">All Difficulties</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Problems Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {filteredProblems.length === 0 ? (
                        <div className="glass-strong p-8 rounded-2xl text-center">
                            <p className="text-gray-400">No problems found</p>
                        </div>
                    ) : (
                        filteredProblems.map((problem, index) => (
                            <Link
                                key={problem.id}
                                to={`/problems/${problem.id}`}
                                className="glass-strong p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300 animate-slideUp"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold">{problem.title}</h3>
                                            {isSolved(problem.id) && (
                                                <span className="text-green-400 text-sm flex items-center gap-1">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Solved
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                            {problem.description.substring(0, 150)}...
                                        </p>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                                                {problem.difficulty.toUpperCase()}
                                            </span>
                                            <span className="text-gray-400 text-sm">{problem.category}</span>
                                            <span className="text-primary text-sm font-semibold">{problem.points} points</span>
                                        </div>
                                    </div>
                                    <div className="text-right ml-4">
                                        <div className="text-sm text-gray-400">
                                            {problem.totalSolved} / {problem.totalAttempts} solved
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Problems;
