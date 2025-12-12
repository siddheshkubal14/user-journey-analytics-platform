import http from 'http';
import dotenv from 'dotenv';
import app from './app';
import { logger } from './shared/utils/logger.util';
import initDatabase from './database';
import loadConfig from './config';

dotenv.config();

const config = loadConfig();

const startServer = async () => {
    try {
        logger.info('Initializing database...');
        const { connection } = await initDatabase();

        if (connection.mongodb) {
            logger.info('Database initialized successfully');
        } else {
            logger.error('Failed to initialize database');
        }

        // Starting server after DB is ready
        const server = http.createServer(app);
        server.listen(config.port, () => {
            logger.info(`Server running on port ${config.port}`);
        });
    } catch (err: any) {
        logger.error('Failed to start server', err);
        process.exit(1);
    }
};

startServer();
