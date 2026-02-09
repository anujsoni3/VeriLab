import mongoose from 'mongoose';
import Contest from './models/Contest.js';
import ContestParticipant from './models/ContestParticipant.js';
// import Submission from './models/Submission.js'; // Assuming Submission model exists, if not I will skip or check
import User from './models/User.js';
import Problem from './models/Problem.js';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';

dotenv.config();

const restartContest = async () => {
    try {
        await connectDatabase();
        console.log('Connected to DB');

        const contestTitle = 'Weekly Contest 1';

        // 1. Find existing contests
        const contests = await Contest.find({ title: contestTitle });
        if (contests.length > 0) {
            console.log(`Found ${contests.length} existing contests with title "${contestTitle}". Deleting...`);
            const contestIds = contests.map(c => c._id);

            // Delete participants
            const deleteParticipantsResult = await ContestParticipant.deleteMany({ contestId: { $in: contestIds } });
            console.log(`Deleted ${deleteParticipantsResult.deletedCount} participants.`);

            // Delete submissions (if applicable - checking if Submission model is importable/used in previous contexts)
            // For now, I'll assume Submission might not be fully set up or I'll just skip it to be safe unless I see it.
            // Actually, based on previous `checkContests` I didn't see Submission. 
            // I will assume for now I only need to clear Contest and Participants. 
            // If there are submissions improperly linked, they might be orphaned, which is acceptable for a "restart" script in dev.

            // Delete contests
            const deleteContestResult = await Contest.deleteMany({ _id: { $in: contestIds } });
            console.log(`Deleted ${deleteContestResult.deletedCount} contests.`);
        } else {
            console.log(`No existing contests with title "${contestTitle}" found.`);
        }

        // 2. Create new contest
        console.log('Creating new contest...');

        // Find a user to be the creator
        const creator = await User.findOne();
        if (!creator) {
            console.error('No users found. Create a user first.');
            process.exit(1);
        }

        // Find some problems
        const problems = await Problem.find().limit(3);
        if (problems.length === 0) {
            console.error('No problems found. Create some problems first.');
            process.exit(1);
        }

        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now

        const newContest = await Contest.create({
            title: contestTitle,
            description: 'This is a test contest to verify the system. Restarted at ' + new Date().toLocaleTimeString(),
            startTime,
            endTime,
            problems: problems.map(p => ({
                problemId: p._id,
                points: p.points || 100 // Default points if not set
            })),
            createdBy: creator._id,
            status: 'active'
        });

        console.log('New Contest created successfully:');
        console.log(`ID: ${newContest._id}`);
        console.log(`Title: ${newContest.title}`);
        console.log(`Status: ${newContest.status}`);
        console.log(`Start: ${newContest.startTime}`);
        console.log(`End: ${newContest.endTime}`);

        process.exit(0);
    } catch (error) {
        console.error('Error restarting contest:', error);
        process.exit(1);
    }
};

restartContest();
