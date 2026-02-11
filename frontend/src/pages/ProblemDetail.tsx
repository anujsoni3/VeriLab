import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../services/api';
import { Problem, Submission } from '../types';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import WaveformViewer from '../components/learning/simulations/WaveformViewer';

const ProblemDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [problem, setProblem] = useState<Problem | null>(null);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [simulating, setSimulating] = useState(false);
    const [simulationOutput, setSimulationOutput] = useState<{ status: string; output: string; vcd?: string } | null>(null);

    useEffect(() => {
        if (id) {
            fetchProblem();
            fetchSubmissions();
            loadSavedCode();
        }
    }, [id]);

    const fetchProblem = async () => {
        try {
            const response = await api.get(`/problems/${id}`);
            if (response.data.success) {
                setProblem(response.data.data);
                if (!code) {
                    setCode(response.data.data.templateCode);
                }
            }
        } catch (error) {
            toast.error('Failed to load problem');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubmissions = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const response = await api.get(`/submissions/user/${user.uid}`);
                if (response.data.success) {
                    const problemSubmissions = response.data.data.filter(
                        (s: Submission) => s.problemId === id
                    );
                    setSubmissions(problemSubmissions);
                }
            }
        } catch (error) {
            console.error('Failed to load submissions');
        }
    };

    const loadSavedCode = () => {
        const saved = localStorage.getItem(`problem_${id}_code`);
        if (saved) {
            setCode(saved);
        }
    };

    const handleCodeChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCode(value);
            localStorage.setItem(`problem_${id}_code`, value);
        }
    };

    const handleSimulate = async () => {
        if (!code.trim()) {
            toast.error('Please write some code before simulating');
            return;
        }

        setSimulating(true);
        setSimulationOutput(null);
        try {
            const response = await api.post('/simulation/run', {
                code,
                problemId: id
            });
            if (response.data.success) {
                setSimulationOutput(response.data.data);
                if (response.data.data.status === 'success') {
                    toast.success('Simulation successful');
                } else {
                    toast.error('Simulation failed');
                }
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Simulation failed');
        } finally {
            setSimulating(false);
        }
    };

    const handleSubmit = async () => {
        if (!code.trim()) {
            toast.error('Please write some code before submitting');
            return;
        }

        // Basic validation for Verilog module
        if (!code.includes('module') || !code.includes('endmodule')) {
            toast.error('Invalid Verilog code: Missing module/endmodule');
            return;
        }

        setSubmitting(true);
        try {
            const response = await api.post('/submissions/submit', {
                problemId: id,
                code,
            });

            if (response.data.success) {
                toast.success('Code submitted for review!');
                fetchSubmissions();
                localStorage.removeItem(`problem_${id}_code`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen animated-gradient flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="min-h-screen animated-gradient flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Problem not found</h2>
                    <Link to="/problems" className="text-primary hover:text-primary-light">
                        Back to Problems
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen animated-gradient p-4">
            <div className="max-w-[1800px] mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold gradient-text">{problem.title}</h1>
                    <Link
                        to="/problems"
                        className="px-4 py-2 glass hover:glass-strong rounded-lg transition-all"
                    >
                        Back to Problems
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-120px)]">
                    {/* Problem Description */}
                    <div className="glass-strong p-6 rounded-2xl overflow-y-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${problem.difficulty === 'easy' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                                problem.difficulty === 'medium' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                                    'text-red-400 bg-red-400/10 border-red-400/20'
                                }`}>
                                {problem.difficulty.toUpperCase()}
                            </span>
                            <span className="text-gray-400">{problem.category}</span>
                            <span className="text-primary font-semibold">{problem.points} points</span>
                        </div>

                        <div className="prose prose-invert max-w-none">
                            <ReactMarkdown>{problem.description}</ReactMarkdown>
                        </div>

                        {/* Submissions History */}
                        {submissions.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <h3 className="text-xl font-semibold mb-4">Your Submissions</h3>
                                <div className="space-y-2">
                                    {submissions.slice(0, 5).map((submission) => (
                                        <div key={submission._id || submission.id} className="glass p-3 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(submission.status)}`}>
                                                        {submission.status.toUpperCase()}
                                                    </span>
                                                    {submission.reviewNotes && (
                                                        <p className="text-sm text-gray-400 mt-1">{submission.reviewNotes}</p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-400">
                                                        {new Date(submission.timestamp).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            {submission.output && (
                                                <div className="mt-3 pt-2 border-t border-white/10">
                                                    <p className="text-xs text-gray-400 mb-1">Execution Output:</p>
                                                    <pre className="text-xs font-mono bg-black/30 p-2 rounded text-gray-300 overflow-x-auto whitespace-pre-wrap">
                                                        {submission.output}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Code Editor */}
                    <div className="glass-strong rounded-2xl overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-surface-hover/50">
                            <h3 className="font-semibold text-text-primary">Code Editor</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSimulate}
                                    disabled={simulating || submitting}
                                    className="px-4 py-2 bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/50 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {simulating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                            Simulating...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Simulate
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || simulating}
                                    className="px-6 py-2 btn btn-primary font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-primary shadow-lg shadow-primary/20"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Code'}
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col min-h-0">
                            <div className="flex-1 min-h-0">
                                <Editor
                                    height="100%"
                                    defaultLanguage="verilog"
                                    value={code}
                                    onChange={handleCodeChange}
                                    theme="vs-dark"
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        lineNumbers: 'on',
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        tabSize: 2,
                                        padding: { top: 16, bottom: 16 },
                                    }}
                                />
                            </div>

                            {/* Simulation Output Console */}
                            {(simulationOutput) && (
                                <div className={`${simulationOutput.vcd ? 'h-96' : 'h-48'} shrink-0 border-t border-border bg-black/50 overflow-hidden flex flex-col transition-all duration-300`}>
                                    <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center bg-white/5">
                                        <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Console Output</span>
                                        <button
                                            onClick={() => setSimulationOutput(null)}
                                            className="text-xs text-text-muted hover:text-text-primary transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                    <div className="flex-1 p-4 overflow-y-auto font-mono text-sm flex flex-col gap-4">
                                        <div>
                                            <div className={simulationOutput.status === 'success' ? 'text-green-400' : 'text-red-400'}>
                                                <span className="font-bold">Status: {simulationOutput.status.toUpperCase()}</span>
                                            </div>
                                            <pre className="mt-2 text-gray-300 whitespace-pre-wrap font-mono">{simulationOutput.output}</pre>
                                        </div>

                                        {simulationOutput.vcd && (
                                            <div className="flex-grow min-h-[300px] border-t border-white/10 pt-4">
                                                <WaveformViewer vcdData={simulationOutput.vcd} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-3 border-t border-white/10 bg-dark-lighter">
                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                <span>💡</span>
                                <span>Your code is auto-saved. Run <strong>Simulate</strong> to check syntax before submitting.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemDetail;
