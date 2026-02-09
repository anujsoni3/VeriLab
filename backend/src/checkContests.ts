import mongoose from 'mongoose';
import Contest from './models/Contest.js';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';

dotenv.config();

const checkContests = async () => {
    try {
        await connectDatabase();
        console.log('Connected to DB');

        const contests = await Contest.find({});
        console.log(`Found ${contests.length} contests.`);
        contests.forEach(c => {
            console.log(`ID: ${c._id}, Title: ${c.title}, Status: ${c.status}, Start: ${c.startTime}, End: ${c.endTime}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error checking contests:', error);
        process.exit(1);
    }
};

checkContests();
