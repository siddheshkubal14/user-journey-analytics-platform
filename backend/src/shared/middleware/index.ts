import { requestLogger } from './request-logger.middleware';
import { errorHandler } from './error-handler.middleware';
import authMiddleware from './auth.middleware';

export default {
    requestLogger,
    errorHandler,
    auth: authMiddleware
};
