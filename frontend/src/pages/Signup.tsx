import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Signup: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: '',
        username: '',
        college: '',
        branch: '',
    });
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signup(formData);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
            <div className="card w-full max-w-md p-8 bg-surface border-border">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-text-primary">Create an account</h2>
                    <p className="text-sm text-text-secondary mt-2">Join the ECE Coding Platform today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input"
                            minLength={8}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-primary">Display Name</label>
                            <input
                                type="text"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleChange}
                                className="input"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-primary">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="input"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">College</label>
                        <input
                            type="text"
                            name="college"
                            value={formData.college}
                            onChange={handleChange}
                            className="input"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">Branch</label>
                        <input
                            type="text"
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            className="input"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full mt-4"
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
                <div className="mt-6 text-center text-sm">
                    <span className="text-text-secondary">Already have an account? </span>
                    <Link to="/login" className="font-medium text-primary hover:text-primary-light transition-colors">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
