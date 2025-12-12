// src/shared/middleware/index.ts
import { requestLogger } from './request-logger.middleware';
import { errorHandler } from './error-handler.middleware';

export default {
    requestLogger,
    errorHandler
};
