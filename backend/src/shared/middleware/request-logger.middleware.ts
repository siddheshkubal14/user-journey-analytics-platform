// src/shared/middleware/request-logger.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.util';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Logging incoming request
    logger.debug('Incoming Request', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
    });

    // Logging response after it finishes
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logLevel = res.statusCode >= 400 ? 'error' : 'info';

        logger[logLevel as 'info' | 'error']('HTTP Request', {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
        });
    });

    next();
};

export default { requestLogger };
