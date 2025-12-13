import mongoose from 'mongoose';
import { logger } from '../shared/utils/logger.util';

export default async (): Promise<typeof mongoose | undefined> => {
    try {
        // Skip if already connected
        if (mongoose.connection.readyState === 1) {
            logger.info('MongoDB already connected, reusing connection');
            return mongoose;
        }

        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';
        logger.info(`Attempting to connect to MongoDB`);

        await mongoose.connect(mongoURI, {
            // Connection pool settings
            maxPoolSize: 10,
            minPoolSize: 2,

            // Timeouts (increased for Lambda cold starts)
            connectTimeoutMS: 10000,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 30000,

            // Retry logic
            retryWrites: true,
            retryReads: true,

            // Connection string options
            maxConnecting: 2,
            waitQueueTimeoutMS: 10000,
        } as any);

        logger.info('MongoDB connected successfully', {
            readyState: mongoose.connection.readyState,
        });
        return mongoose;
    } catch (err: any) {
        logger.error('MongoDB connection failed', { error: err.message });
        return undefined;
    }
};


