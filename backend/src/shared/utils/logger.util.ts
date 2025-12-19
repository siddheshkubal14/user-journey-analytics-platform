/**
 * Structured logger with CloudWatch support for monitoring
 */

const log = (level: string, message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level,
        message,
        service: 'user-journey-analytics-backend',
        environment: process.env.NODE_ENV || 'development',
        ...data
    };

    if (level === 'ERROR' || level === 'WARN') {
        console.error(JSON.stringify(logEntry));
    } else {
        console.log(JSON.stringify(logEntry));
    }
};

export const logger = {
    info: (message: string, data?: any) => log('INFO', message, data),
    error: (message: string, data?: any) => log('ERROR', message, data),
    debug: (message: string, data?: any) => log('DEBUG', message, data),
    warn: (message: string, data?: any) => log('WARN', message, data),
    metric: (message: string, data?: any) => log('METRIC', message, data)
};
