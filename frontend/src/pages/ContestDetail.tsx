import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../services/api';
import { Contest, ApiResponse, Problem } from '../types';
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

    useEffect(() => {
        const fetchContest = async () => {
            if (!id) return;
            try {
                const response = await api.get<ApiResponse<Contest>>(`/contests/${id}`);
                if (response.data.success && response.data.data) {
                    setContest(response.data.data);
                    // Check if already registered
                    if (user && response.data.data.participants.includes(user.uid)) {
                        setIsRegistered(true);
                    }
                    // Since the participants array might only show IDs, and we might not have loaded full participants list here,
                    // we rely on the backend response. 
                    // However, my backend 'getContestById' returns the contest object. 
                    // If 'participants' is array of ObjectIds, checking includes(user.uid) works if user.uid is string and array has strings.
                    // Important: Backend Contest model 'participants' is Ref to User. 
                    // If not populated, it's IDs. My controller doesn't populate participants in getContestById.
                }
            } catch (error: any) {
                toast.error('Failed to load contest details');
            } finally {
                setLoading(false);
            }
        };

        fetchContest();
    }, [id, user]);

    const handleRegister = async () => {
        if (!contest || !user) return;
        setRegistering(true);
        try {
            const response = await api.post<ApiResponse<any>>(`/contests/${contest._id}/register`);
            if (response.data.success) {
                toast.success('Registered successfully!');
                setIsRegistered(true);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Registration failed');
        } finally {
            setRegistering(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!contest) return <div className="p-8 text-center">Contest not found</div>;

    const isActive = contest.status === 'active';
    const isUpcoming = contest.status === 'upcoming';

    // Check if user is registered to see problems (if active)
    // Actually, traditionally you must register to see problems? Or just to submit?
    // Let's assume you must register.

    const showProblems = isActive && isRegistered;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-surface border border-border rounded-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold text-text-primary">{contest.title}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${contest.status === 'active' ? 'bg-green-100 text-green-800' :
                        contest.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {contest.status}
                    </span>
                </div>

                <p className="text-text-secondary mb-6">{contest.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary mb-6">
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

                {(isUpcoming || isActive) && isRegistered && (
                    <div className="p-4 bg-primary/10 text-primary rounded-md mb-6">
                        {isActive ? 'You are registered! Good luck!' : 'You are registered! Come back when the contest starts.'}
                    </div>
                )}
            </div>

            {showProblems && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-text-primary">Problems</h2>
                    <div className="grid gap-4">
                        {contest.problems.map((p, index) => {
                            // Assuming problems are populated with title/slug/difficulty
                            // The backend controller populates 'problems.problemId'
                            const problem = p.problemId as unknown as Problem;
                            return (
                                <Link
                                    key={index}
                                    to={`/problems/${problem.id || (problem as any)._id}`} // Handle _id vs id
                                    className="block bg-surface border border-border rounded-lg p-4 hover:border-primary transition-colors"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-text-primary">
                                            {index + 1}. {problem.title}
                                        </span>
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
