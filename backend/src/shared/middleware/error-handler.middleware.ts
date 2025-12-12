// src/shared/middleware/error-handler.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.util';
import { ApiResponse } from '../utils/response.util';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    logger.error('Error caught by middleware', {
        status,
        message,
        path: req.path,
        method: req.method,
        stack: err.stack,
    });

    const errorResponse: ApiResponse = {
        success: false,
        error: message,
        message: 'An error occurred',
        statusCode: status,
    };

    return res.status(status).json(errorResponse);
};
