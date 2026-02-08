import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        college: user?.college || '',
        branch: user?.branch || '',
    });
    const [saving, setSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await api.put(`/users/${user?.uid}`, formData);
            if (response.data.success) {
                toast.success('Profile updated successfully!');

                // Update local storage
                const updatedUser = { ...user, ...formData };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                setEditing(false);
                window.location.reload(); // Reload to update context
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            displayName: user?.displayName || '',
            college: user?.college || '',
            branch: user?.branch || '',
        });
        setEditing(false);
    };

    return (
        <div className="min-h-screen animated-gradient p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold gradient-text">Profile</h1>
                    <Link
                        to="/dashboard"
                        className="px-4 py-2 glass hover:glass-strong rounded-lg transition-all"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Stats Card */}
                    <div className="glass-strong p-6 rounded-2xl">
                        <h2 className="text-xl font-semibold mb-4">Statistics</h2>
                        <div className="space-y-4">
                            <div className="glass p-4 rounded-lg">
                                <p className="text-gray-400 text-sm">Problems Solved</p>
                                <p className="text-3xl font-bold text-primary">{user?.solvedProblems?.length || 0}</p>
                            </div>
                            <div className="glass p-4 rounded-lg">
                                <p className="text-gray-400 text-sm">Total Points</p>
                                <p className="text-3xl font-bold text-secondary">{user?.totalPoints || 0}</p>
                            </div>
                            <div className="glass p-4 rounded-lg">
                                <p className="text-gray-400 text-sm">Rank</p>
                                <p className="text-3xl font-bold text-accent-cyan">#{user?.rank || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="lg:col-span-2 glass-strong p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Personal Information</h2>
                            {!editing && (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="px-4 py-2 bg-primary hover:bg-primary-light rounded-lg font-semibold transition-all"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full px-4 py-2 bg-dark-lighter border border-white/10 rounded-lg opacity-50 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                                <input
                                    type="text"
                                    value={user?.username || ''}
                                    disabled
                                    className="w-full px-4 py-2 bg-dark-lighter border border-white/10 rounded-lg opacity-50 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                                <input
                                    type="text"
                                    name="displayName"
                                    value={formData.displayName}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className={`w-full px-4 py-2 bg-dark-lighter border border-white/10 rounded-lg transition-colors ${editing ? 'focus:outline-none focus:border-primary' : 'opacity-50 cursor-not-allowed'
                                        }`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">College</label>
                                <input
                                    type="text"
                                    name="college"
                                    value={formData.college}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className={`w-full px-4 py-2 bg-dark-lighter border border-white/10 rounded-lg transition-colors ${editing ? 'focus:outline-none focus:border-primary' : 'opacity-50 cursor-not-allowed'
                                        }`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Branch</label>
                                <input
                                    type="text"
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className={`w-full px-4 py-2 bg-dark-lighter border border-white/10 rounded-lg transition-colors ${editing ? 'focus:outline-none focus:border-primary' : 'opacity-50 cursor-not-allowed'
                                        }`}
                                />
                            </div>

                            {editing && (
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex-1 py-3 bg-primary hover:bg-primary-light rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 py-3 glass hover:glass-strong rounded-lg font-semibold transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/10">
                            <p className="text-sm text-gray-400 mb-2">Account created on:</p>
                            <p className="font-semibold">
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
