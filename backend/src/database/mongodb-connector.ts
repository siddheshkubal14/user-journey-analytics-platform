import mongoose from 'mongoose';
import { logger } from '../shared/utils/logger.util';

export default async (): Promise<typeof mongoose | undefined> => {
    try {

        //TBD: Connection pooling let cached: typeof mongoose | null = null;
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';
        logger.info(`Attempting to connect to MongoDB at ${mongoURI}`);

        await mongoose.connect(mongoURI, {
            connectTimeoutMS: 5000,
            serverSelectionTimeoutMS: 5000,
        } as any);

        logger.info('MongoDB connected successfully');
        return mongoose;
    } catch (err: any) {
        logger.error('MongoDB connection failed', { error: err.message });
        return undefined;
    }
};


