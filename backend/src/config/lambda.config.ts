// Lambda-specific configuration
export const lambdaConfig = {
    // Connection pooling
    mongoPoolSize: {
        min: 2,
        max: 10,
    },

    // Timeouts (in milliseconds)
    timeouts: {
        connection: 10000,        // 10 seconds for connection
        serverSelection: 10000,   // 10 seconds for server selection
        socket: 30000,            // 30 seconds for socket operations
        queryBuffer: 30000,       // 30 seconds for query buffering
    },

    // Lambda-specific settings
    lambda: {
        // Keep connection alive across invocations
        keepAlive: true,

        // Reuse connections
        reuseConnections: true,

        // Connection timeout
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

// MongoDB connection URI validation for Lambda
export const validateMongoURI = (uri: string): boolean => {
    if (!uri) {
        console.error('MONGO_URI environment variable is not set');
        return false;
    }

    // Check if it's a valid MongoDB URI
    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
        console.error('Invalid MongoDB URI format');
        return false;
    }

    return true;
};

// Get Lambda-optimized connection options
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
        // Allow connection pooling across Lambda invocations
        family: 4, // Use IPv4
    };
};
