import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    // Logout is handled in Navbar now

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
                </div>

                <div className="card p-6 bg-surface border-border">
                    <h2 className="text-xl font-semibold text-text-primary mb-6">Welcome back, {user?.displayName}!</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 rounded-lg bg-background-subtle border border-border">
                            <p className="text-sm text-text-muted mb-1">Problems Solved</p>
                            <p className="text-3xl font-bold text-primary">{user?.solvedProblems?.length || 0}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background-subtle border border-border">
                            <p className="text-sm text-text-muted mb-1">Total Points</p>
                            <p className="text-3xl font-bold text-text-primary">{user?.totalPoints || 0}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background-subtle border border-border">
                            <p className="text-sm text-text-muted mb-1">Current Rank</p>
                            <p className="text-3xl font-bold text-text-primary">#{user?.rank || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Link to="/problems" className="card p-6 bg-surface border-border hover:border-primary/50 transition-colors group">
                        <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">Problems</h3>
                        <p className="text-sm text-text-secondary">Practice Verilog coding with our curated collection of digital design problems.</p>
                    </Link>

                    <Link to="/quizzes" className="card p-6 bg-surface border-border hover:border-primary/50 transition-colors group">
                        <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">Quizzes</h3>
                        <p className="text-sm text-text-secondary">Test your theoretical knowledge with timed quizzes and assessments.</p>
                    </Link>

                    <Link to="/leaderboard" className="card p-6 bg-surface border-border hover:border-primary/50 transition-colors group">
                        <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">Leaderboard</h3>
                        <p className="text-sm text-text-secondary">See top performers and compete with peers for the top ranks.</p>
                    </Link>

                    <Link to="/profile" className="card p-6 bg-surface border-border hover:border-primary/50 transition-colors group">
                        <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">Profile</h3>
                        <p className="text-sm text-text-secondary">Manage your account settings and view your detailed statistics.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
