import dotenv from 'dotenv';

dotenv.config();

process.env.NODE_ENV = 'test';
process.env.API_KEY = process.env.API_KEY || 'test-key';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
process.env.AUTH_ENABLED = 'true';

jest.mock('../database/mongodb-connector', () => ({
    connectToDatabase: jest.fn().mockResolvedValue(undefined),
    disconnectFromDatabase: jest.fn().mockResolvedValue(undefined),
}));
