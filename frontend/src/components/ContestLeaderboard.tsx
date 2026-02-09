import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';
import { ContestParticipant, User, ApiResponse } from '../types';

interface ContestLeaderboardProps {
    contestId: string;
}

const ContestLeaderboard: React.FC<ContestLeaderboardProps> = ({ contestId }) => {
    const [participants, setParticipants] = useState<ContestParticipant[]>([]);

    useEffect(() => {
        // Initial fetch
        const fetchLeaderboard = async () => {
            try {
                const response = await api.get<ApiResponse<ContestParticipant[]>>(`/contests/${contestId}/leaderboard`);
                if (response.data.success && response.data.data) {
                    setParticipants(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch leaderboard', error);
            }
        };

        fetchLeaderboard();

        // Socket connection
        // Adjust URL if needed (port 5000 is backend)
        const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

        socket.emit('join_contest', contestId);

        socket.on('leaderboard_update', () => {
            // Re-fetch or update locally. Re-fetching is safer for sorting but heavier.
            // For now, let's re-fetch to ensure correct sorting and data consistency
            fetchLeaderboard();
        });

        return () => {
            socket.disconnect();
        };
    }, [contestId]);

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-text-primary">Live Leaderboard</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface border-b border-border">
                            <th className="p-4 text-text-secondary font-medium">Rank</th>
                            <th className="p-4 text-text-secondary font-medium">User</th>
                            <th className="p-4 text-text-secondary font-medium">Score</th>
                            {/* <th className="p-4 text-text-secondary font-medium">Finish Time</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {participants.map((participant, index) => {
                            const user = participant.userId as unknown as User; // Cast populated user
                            return (
                                <tr key={participant._id} className="border-b border-border hover:bg-surface/50">
                                    <td className="p-4 text-text-primary">{index + 1}</td>
                                    <td className="p-4 text-text-primary font-medium">
                                        {user?.displayName || 'Unknown User'}
                                    </td>
                                    <td className="p-4 text-text-primary">{participant.score}</td>
                                    {/* <td className="p-4 text-text-secondary text-sm">
                                        {participant.finishTime ? new Date(participant.finishTime).toLocaleTimeString() : '-'}
                                    </td> */}
                                </tr>
                            );
                        })}
                        {participants.length === 0 && (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-text-secondary">
                                    No participants yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContestLeaderboard;
