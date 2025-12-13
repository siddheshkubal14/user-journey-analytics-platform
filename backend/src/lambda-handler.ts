import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import app from './app';
import { logger } from './shared/utils/logger.util';
import initDatabase from './database';
import loadConfig from './config';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import serverlessExpress from '@vendia/serverless-express';

// Load env variables
dotenv.config();

// Cache for serverless-express
let cachedServer: any;
let cachedDbConnection: boolean = false;

// Initialize database once per Lambda container
const initializeDatabase = async () => {
    if (cachedDbConnection) {
        logger.info('Using cached MongoDB connection');
        return;
    }

    try {
        logger.info('Initializing MongoDB connection for Lambda...');

        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            logger.info('MongoDB already connected (readyState: 1)');
            cachedDbConnection = true;
            return;
        }

        const { connection } = await initDatabase();

        if (connection) {
            logger.info('Database initialized successfully');
            cachedDbConnection = true;
        } else {
            logger.error('Failed to initialize database');
            throw new Error('Database initialization failed');
        }
    } catch (err: any) {
        logger.error('Database initialization error', {
            message: err.message,
            stack: err.stack,
        });
        throw err;
    }
};

// Create serverless express server
const createServer = () => {
    return serverlessExpress({
        app,
    });
};

// Lambda handler
export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
    try {
        // Important: Keep Lambda process alive during async operations
        context.callbackWaitsForEmptyEventLoop = false;

        logger.info('Lambda invoked', {
            path: event.rawPath,
            method: event.requestContext?.http?.method,
            sourceIp: event.requestContext?.http?.sourceIp,
            requestId: event.requestContext?.requestId,
        });

        // Initialize database on first invocation
        if (!cachedDbConnection) {
            await initializeDatabase();
        }

        // Create server if not cached
        if (!cachedServer) {
            logger.info('Creating serverless express server');
            cachedServer = createServer();
        }

        // Handle request
        const response = await cachedServer(event, context);

        logger.info('Request processed successfully', {
            statusCode: response.statusCode,
        });

        return response;
    } catch (err: any) {
        logger.error('Lambda handler error', {
            message: err.message,
            stack: err.stack,
        });

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                success: false,
                error: 'Internal server error',
                message: err.message,
                statusCode: 500,
            }),
        };
    }
};
