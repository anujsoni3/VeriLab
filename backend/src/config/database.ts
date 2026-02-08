import mongoose from 'mongoose';
import { logger } from '../middleware/errorHandler.js';

export const connectDatabase = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI!);
        logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        logger.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default mongoose;
