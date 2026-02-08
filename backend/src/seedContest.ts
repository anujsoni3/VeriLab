import mongoose from 'mongoose';
import Contest from './models/Contest.js';
import Problem from './models/Problem.js';
import User from './models/User.js';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';

dotenv.config();

const createTestContest = async () => {
    try {
        await connectDatabase();
        console.log('Connected to DB');

        // Find a user to be the creator (first user found)
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

        const contest = await Contest.create({
            title: 'Weekly Contest 1',
            description: 'This is a test contest to verify the system.',
            startTime,
            endTime,
            problems: problems.map(p => ({
                problemId: p._id,
                points: p.points
            })),
            createdBy: creator._id,
            status: 'active'
        });

        console.log('Contest created successfully:');
        console.log(`ID: ${contest._id}`);
        console.log(`Title: ${contest.title}`);
        console.log(`Status: ${contest.status}`);

        process.exit(0);
    } catch (error) {
        console.error('Error creating contest:', error);
        process.exit(1);
    }
};

createTestContest();
