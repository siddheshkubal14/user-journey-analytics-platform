import dotenv from 'dotenv';
dotenv.config();

import loadConfig from '../config';
import initDatabase from '../database';
import { exportDailyAnalytics } from './analytics-export.job';
import { logger } from '../shared/utils/logger.util';

const run = async () => {
    try {
        loadConfig();
        const { connection } = await initDatabase();
        if (!connection) {
            logger.error('Database initialization failed');
            process.exit(1);
        }
        const result = await exportDailyAnalytics();
        if (!result.success) {
            logger.error('Export failed', { message: result.message });
            process.exit(1);
        }
        logger.info('Export completed');
        process.exit(0);
    } catch (err: any) {
        logger.error('Export run error', { message: err.message });
        process.exit(1);
    }
};

run();
