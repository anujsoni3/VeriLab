import { Request, Response } from 'express';
import Submission from '../models/Submission.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';

import { compileAndRun } from '../services/compilerService.js';
import Contest from '../models/Contest.js';
import ContestParticipant from '../models/ContestParticipant.js';
import { io } from '../server.js';

export const submitCode = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, error: 'Not authenticated' });
            return;
        }

        const { problemId, code } = req.body;

        if (!problemId || !code) {
            res.status(400).json({ success: false, error: 'Problem ID and code are required' });
            return;
        }

        const problem = await Problem.findById(problemId);

        if (!problem) {
            res.status(404).json({ success: false, error: 'Problem not found' });
            return;
        }

        // Execute code
        let submissionStatus: 'pending' | 'accepted' | 'rejected' = 'pending';
        let pointsEarned = 0;
        let executionOutput = '';

        if (problem.testbench) {
            const result = await compileAndRun(code, problem.testbench);
            executionOutput = result.output;

            // Simple heuristic: if execution succeeded and output doesn't contain explicit failure message
            // You might want to refine this based on your testbench strategy (e.g., look for "PASS" or check exit code)
            // For now, checks if compilation/runtime failed (result.success = false) or if "FAIL" is in output
            if (result.success && !result.output.includes('FAIL')) {
                submissionStatus = 'accepted';
                pointsEarned = problem.points;
            } else {
                submissionStatus = 'rejected';
            }
        } else {
            // Fallback if no testbench (shouldn't happen with new seed)
            executionOutput = 'No testbench found for this problem.';
            submissionStatus = 'pending'; // Or rejected?
        }

        // Create submission
        const submission = await Submission.create({
            userId: req.user!.uid,
            problemId,
            code,
            status: submissionStatus,
            reviewedBy: null, // Auto-graded
            reviewNotes: submissionStatus === 'accepted' ? 'Auto-graded: Passed' : 'Auto-graded: Failed',
            pointsEarned,
            output: executionOutput,
        });

        // Update problem attempts
        await Problem.findByIdAndUpdate(problemId, {
            $inc: { totalAttempts: 1, totalSolved: submissionStatus === 'accepted' ? 1 : 0 },
        });

        // Update user stats if accepted
        if (submissionStatus === 'accepted') {
            const user = await User.findById(req.user!.uid);
            if (user && !user.solvedProblems.includes(problemId)) {
                await User.findByIdAndUpdate(req.user!.uid, {
                    $inc: { totalPoints: pointsEarned },
                    $push: { solvedProblems: problemId }
                });
            }
        }

        // --- CONTEST LOGIC START ---
        // Check if this problem is part of an active contest
        const activeContest = await Contest.findOne({
            'problems.problemId': problemId,
            status: 'active',
            startTime: { $lte: new Date() },
            endTime: { $gte: new Date() }
        });

        if (activeContest) {
            const userId = req.user!.uid;
            let participant = await ContestParticipant.findOne({ contestId: activeContest._id, userId });

            if (participant) {
                const problemConfig = activeContest.problems.find(p => p.problemId.toString() === problemId);
                const problemPoints = problemConfig ? problemConfig.points : 0;

                // Initialize submission entry if not exists
                if (!participant.submissions.get(problemId)) {
                    participant.submissions.set(problemId, {
                        status: 'pending',
                        attempts: 0,
                        solvedAt: null
                    });
                }

                const subEntry = participant.submissions.get(problemId)!;

                // Only update if not already accepted (or maybe allow improvement? usually CP doesn't allow point increase after accept)
                if (subEntry.status !== 'accepted') {
                    subEntry.attempts += 1;
                    subEntry.status = submissionStatus;

                    if (submissionStatus === 'accepted') {
                        subEntry.solvedAt = new Date();
                        participant.score += problemPoints;
                        // Time penalty could be implementation here: (ActiveTime - StartTime) + (Attempts * 20min)
                        // For now, just adding points.
                        participant.finishTime = new Date();
                    }

                    participant.submissions.set(problemId, subEntry);
                    await participant.save();

                    // Emit real-time update
                    io.to(activeContest._id.toString()).emit('leaderboard_update', {
                        contestId: activeContest._id,
                        userId,
                        score: participant.score,
                        participant // Send full participant object or tailored one
                    });
                }
            }
        }
        // --- CONTEST LOGIC END ---

        res.status(201).json({
            success: true,
            data: {
                id: submission._id.toString(),
                message: `Code submitted. Status: ${submissionStatus}`,
                output: executionOutput,
                status: submissionStatus,
            },
        });
    } catch (error) {
        console.error('Submit code error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const getUserSubmissions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        const submissions = await Submission.find({ userId }).sort({ timestamp: -1 });

        res.json({ success: true, data: submissions });
    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const reviewSubmission = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, error: 'Not authenticated' });
            return;
        }

        const { id } = req.params;
        const { status, reviewNotes } = req.body;

        if (!status || !['accepted', 'rejected'].includes(status)) {
            res.status(400).json({ success: false, error: 'Invalid status' });
            return;
        }

        const submission = await Submission.findById(id);

        if (!submission) {
            res.status(404).json({ success: false, error: 'Submission not found' });
            return;
        }

        // Get problem to award points
        const problem = await Problem.findById(submission.problemId);

        let pointsEarned = 0;

        if (status === 'accepted' && problem) {
            pointsEarned = problem.points;

            // Update user points and solved problems
            const user = await User.findById(submission.userId);

            if (user && !user.solvedProblems.includes(submission.problemId.toString())) {
                await User.findByIdAndUpdate(submission.userId, {
                    $inc: { totalPoints: pointsEarned },
                    $push: { solvedProblems: submission.problemId.toString() },
                });

                // Update problem solved count
                await Problem.findByIdAndUpdate(submission.problemId, {
                    $inc: { totalSolved: 1 },
                });
            }
        }

        // Update submission
        submission.status = status as 'accepted' | 'rejected';
        submission.reviewedBy = req.user.uid as any;
        submission.reviewNotes = reviewNotes || null;
        submission.pointsEarned = pointsEarned;
        await submission.save();

        res.json({
            success: true,
            data: { message: `Submission ${status}` },
        });
    } catch (error) {
        console.error('Review submission error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
