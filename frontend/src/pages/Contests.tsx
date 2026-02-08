import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../services/api'; // Ensure this path is correct
import { Contest, ApiResponse } from '../types';
import toast from 'react-hot-toast';

const Contests: React.FC = () => {
    const [contests, setContests] = useState<Contest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await api.get<ApiResponse<Contest[]>>('/contests');
                if (response.data.success && response.data.data) {
                    setContests(response.data.data);
                }
            } catch (error: any) {
                toast.error('Failed to load contests');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchContests();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-green-500';
            case 'upcoming': return 'text-yellow-500';
            case 'ended': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading contests...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-text-primary">Contests</h1>

            <div className="grid gap-6">
                {contests.map((contest) => (
                    <div key={contest._id} className="bg-surface border border-border rounded-lg p-6 hover:border-primary transition-colors">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-text-primary mb-2">{contest.title}</h3>
                                <p className="text-text-secondary mb-4">{contest.description}</p>
                                <div className="text-sm text-text-secondary space-y-1">
                                    <p>Start: {format(new Date(contest.startTime), 'PPpp')}</p>
                                    <p>End: {format(new Date(contest.endTime), 'PPpp')}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-4">
                                <span className={`font-medium capitalize ${getStatusColor(contest.status)}`}>
                                    {contest.status}
                                </span>
                                <Link
                                    to={`/contests/${contest._id}`}
                                    className="btn btn-primary"
                                >
                                    {contest.status === 'upcoming' ? 'View Details' : 'Enter Contest'}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {contests.length === 0 && (
                    <div className="text-center text-text-secondary py-12">
                        No contests found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Contests;
