import { logger } from '../shared/utils/logger.util';

export const lambdaConfig = {
    mongoPoolSize: {
        min: 2,
        max: 10,
    },

    timeouts: {
        connection: 10000,
        serverSelection: 10000,
        socket: 30000,
        queryBuffer: 30000,
    },

    lambda: {
        keepAlive: true,
        reuseConnections: true,
        contextCallbackWaitsForEmptyEventLoop: false,
    },

    // Retry strategy
    retry: {
        maxRetries: 3,
        retryWrites: true,
        retryReads: true,
    },

    // Logging
    logging: {
        mongooseLogs: true,
        connectionLogs: true,
    },
};

export const validateMongoURI = (uri: string): boolean => {
    if (!uri) {
        logger.error('MongoDB URI missing');
        return false;
    }

    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
        logger.error('Invalid MongoDB URI format');
        return false;
    }

    return true;
};


export const getLambdaConnectionOptions = () => {
    return {
        maxPoolSize: lambdaConfig.mongoPoolSize.max,
        minPoolSize: lambdaConfig.mongoPoolSize.min,
        connectTimeoutMS: lambdaConfig.timeouts.connection,
        serverSelectionTimeoutMS: lambdaConfig.timeouts.serverSelection,
        socketTimeoutMS: lambdaConfig.timeouts.socket,
        maxConnecting: 2,
        waitQueueTimeoutMS: lambdaConfig.timeouts.queryBuffer,
        retryWrites: lambdaConfig.retry.retryWrites,
        retryReads: lambdaConfig.retry.retryReads,
        family: 4,
    };
};
