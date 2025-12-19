import mongoConnector from './mongodb-connector';
import { logger } from '../shared/utils/logger.util';

export default async (): Promise<{ types: string[]; connection: Record<string, any> }> => {
    const types: string[] = [];
    const connection: Record<string, any> = {};

    try {
        types.push('mongodb');
        connection.mongodb = await mongoConnector();
    } catch (err) {
        logger.error('Failed to initialize database', { error: err });
    }

    return { types, connection };
};
