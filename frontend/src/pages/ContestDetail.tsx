import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../services/api';
import { Contest, ApiResponse, Problem, ContestParticipant } from '../types';
import toast from 'react-hot-toast';
import ContestLeaderboard from '../components/ContestLeaderboard';
import { useAuth } from '../hooks/useAuth';

const ContestDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [contest, setContest] = useState<Contest | null>(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [participation, setParticipation] = useState<ContestParticipant | null>(null);
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        const fetchContest = async () => {
            if (!id) return;
            try {
                const response = await api.get<ApiResponse<Contest>>(`/contests/${id}`);
                if (response.data.success && response.data.data) {
                    setContest(response.data.data);
                }
            } catch (error: any) {
                toast.error('Failed to load contest details');
            } finally {
                setLoading(false);
            }
        };

        const fetchParticipation = async () => {
            if (!id || !user) return;
            try {
                const response = await api.get<ApiResponse<ContestParticipant>>(`/contests/${id}/participation`);
                if (response.data.success && response.data.data) {
                    setParticipation(response.data.data);
                    setIsRegistered(true);
                }
            } catch (error) {
                // Not participating or error
                setIsRegistered(false);
            }
        };

        fetchContest();
        fetchParticipation();
    }, [id, user]);

    // Timer Logic
    useEffect(() => {
        if (!contest) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const start = new Date(contest.startTime).getTime();
            const end = new Date(contest.endTime).getTime();

            if (now < start) {
                const distance = start - now;
                setTimeLeft(`Starts in: ${formatTime(distance)}`);
            } else if (now >= start && now < end) {
                const distance = end - now;
                setTimeLeft(`Ends in: ${formatTime(distance)}`);
            } else {
                setTimeLeft('Contest Ended');
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [contest]);

    const formatTime = (ms: number) => {
        const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    const handleRegister = async () => {
        if (!contest || !user) return;
        setRegistering(true);
        try {
            const response = await api.post<ApiResponse<any>>(`/contests/${contest._id}/register`);
            if (response.data.success) {
                toast.success('Registered successfully!');
                setIsRegistered(true);
                // Fetch participation to initialize state
                const partResponse = await api.get<ApiResponse<ContestParticipant>>(`/contests/${contest._id}/participation`);
                if (partResponse.data.success) setParticipation(partResponse.data.data!);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Registration failed');
        } finally {
            setRegistering(false);
        }
    };

    const getProblemStatus = (problemId: string) => {
        if (!participation || !participation.submissions) return 'unattempted';

        // participation.submissions is a Map object from backend, but over JSON it comes as an object/dictionary
        const subs = participation.submissions as unknown as { [key: string]: { status: string } };
        const entry = subs[problemId];

        if (!entry) return 'unattempted';
        return entry.status;
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!contest) return <div className="p-8 text-center">Contest not found</div>;

    const isActive = contest.status === 'active';
    const isUpcoming = contest.status === 'upcoming';

    const showProblems = (isActive || contest.status === 'ended') && isRegistered;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-surface border border-border rounded-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">{contest.title}</h1>
                        <p className="text-text-secondary mt-2">{contest.description}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-mono font-bold text-primary mb-1">
                            {timeLeft}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${contest.status === 'active' ? 'bg-green-100 text-green-800' :
                                contest.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                            }`}>
                            {contest.status}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary mb-6 pt-4 border-t border-border">
                    <div>
                        <span className="font-semibold block text-text-primary">Start Time</span>
                        {format(new Date(contest.startTime), 'PPpp')}
                    </div>
                    <div>
                        <span className="font-semibold block text-text-primary">End Time</span>
                        {format(new Date(contest.endTime), 'PPpp')}
                    </div>
                </div>

                {(isUpcoming || isActive) && !isRegistered && (
                    <button
                        onClick={handleRegister}
                        disabled={registering}
                        className="btn btn-primary w-full md:w-auto"
                    >
                        {registering ? 'Registering...' : 'Register for Contest'}
                    </button>
                )}

                {isRegistered && (
                    <div className="p-4 bg-primary/10 text-primary rounded-md mb-6 flex justify-between items-center">
                        <span>
                            {isActive ? 'You are participating! Good luck!' : 'You are registered! Come back when the contest starts.'}
                        </span>
                        {participation && (
                            <span className="font-bold">Score: {participation.score}</span>
                        )}
                    </div>
                )}
            </div>

            {showProblems && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-text-primary">Problems</h2>
                    <div className="grid gap-4">
                        {contest.problems.map((p, index) => {
                            const problem = p.problemId as unknown as Problem;
                            // Helper to handle mixed ID types (string vs populated object)
                            const problemId = typeof p.problemId === 'string' ? p.problemId : (problem.id || (problem as any)._id);
                            const status = getProblemStatus(problemId);

                            return (
                                <Link
                                    key={index}
                                    to={`/problems/${problemId}`}
                                    className={`block bg-surface border rounded-lg p-4 transition-colors ${status === 'accepted' ? 'border-green-500 bg-green-500/5' :
                                            status === 'rejected' ? 'border-red-500/50 hover:border-red-500' :
                                                'border-border hover:border-primary'
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium text-text-primary">
                                                {index + 1}. {problem.title}
                                            </span>
                                            {status === 'accepted' && (
                                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500 text-white">
                                                    SOLVED
                                                </span>
                                            )}
                                            {status === 'rejected' && (
                                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-500">
                                                    ATTEMPTED
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm px-2 py-0.5 rounded bg-surface-hover text-text-secondary">
                                            {p.points} pts
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {(isActive || contest.status === 'ended') && (
                <ContestLeaderboard contestId={contest._id} />
            )}
        </div>
    );
};

export default ContestDetail;
