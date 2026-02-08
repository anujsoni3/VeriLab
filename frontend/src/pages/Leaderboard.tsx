import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { LeaderboardEntry } from '../types';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const Leaderboard: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await api.get('/leaderboard');
            if (response.data.success) {
                setLeaderboard(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load leaderboard');
        } finally {
            setLoading(false);
        }
    };

    const getMedalEmoji = (rank: number) => {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return null;
        }
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
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold gradient-text">Leaderboard</h1>
                    <Link
                        to="/dashboard"
                        className="px-4 py-2 glass hover:glass-strong rounded-lg transition-all"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                <div className="glass-strong rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-xl font-semibold">Top 10 Coders</h2>
                        <p className="text-gray-400 text-sm mt-1">Compete and climb the ranks!</p>
                    </div>

                    {leaderboard.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            No users on the leaderboard yet
                        </div>
                    ) : (
                        <div className="divide-y divide-white/10">
                            {leaderboard.map((entry, index) => (
                                <div
                                    key={entry.uid}
                                    className={`p-6 transition-all duration-300 animate-slideUp ${entry.uid === user?.uid ? 'bg-primary/10 glow-primary' : 'hover:bg-white/5'
                                        }`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            {/* Rank */}
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-dark-lighter font-bold text-lg">
                                                {getMedalEmoji(entry.rank) || `#${entry.rank}`}
                                            </div>

                                            {/* User Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-lg">{entry.displayName}</h3>
                                                    {entry.uid === user?.uid && (
                                                        <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                                                            You
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-400 text-sm">@{entry.username}</p>
                                            </div>

                                            {/* Stats */}
                                            <div className="hidden md:flex items-center gap-8">
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-primary">{entry.totalPoints}</p>
                                                    <p className="text-xs text-gray-400">Points</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-secondary">{entry.solvedProblems}</p>
                                                    <p className="text-xs text-gray-400">Solved</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mobile Stats */}
                                        <div className="md:hidden text-right">
                                            <p className="text-xl font-bold text-primary">{entry.totalPoints}</p>
                                            <p className="text-sm text-gray-400">{entry.solvedProblems} solved</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* User's Rank (if not in top 10) */}
                {user && !leaderboard.find(e => e.uid === user.uid) && (
                    <div className="mt-6 glass-strong p-6 rounded-2xl">
                        <h3 className="font-semibold mb-2">Your Rank</h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400">Keep solving problems to climb the leaderboard!</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-primary">{user.totalPoints}</p>
                                <p className="text-sm text-gray-400">{user.solvedProblems?.length || 0} solved</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
