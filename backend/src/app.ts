import express, { Application } from 'express';

import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import sharedMiddleware from './shared/middleware';

import userRoutes from './domains/users/user.routes';
import sessionRoutes from './domains/sessions/session.routes';
import eventRoutes from './domains/events/event.routes';
import analyticsRoutes from './domains/analytics/analytics.routes';
import healthRoutes from './domains/health/health.routes';
import { logger } from './shared/utils/logger.util';
import { swaggerSpec } from './config/swagger.config';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware
app.use(sharedMiddleware.requestLogger);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: false,
    customCss: `
            .swagger-ui .topbar { display: none }
            .swagger-ui .try-out__btn { display: none }
            .swagger-ui .btn.try-out__btn { display: none }
        `,
    customSiteTitle: 'User Journey Analytics API',
    swaggerOptions: {
        supportedSubmitMethods: [],
        docExpansion: 'list',
        defaultModelsExpandDepth: -1,
        defaultModelExpandDepth: 1,
        displayOperationId: true,
        operationsSorter: 'alpha',
        tagsSorter: 'alpha'
    }
}));

// Health check endpoints
app.use('/', healthRoutes);

// Protected routes
app.use('/users', sharedMiddleware.auth, userRoutes);
app.use('/sessions', sharedMiddleware.auth, sessionRoutes);
app.use('/events', sharedMiddleware.auth, eventRoutes);
app.use('/analytics', sharedMiddleware.auth, analyticsRoutes);


app.get('/', (_req, res) => res.json({ status: 'ok' }));

// Error Handling Middleware 
app.use(sharedMiddleware.errorHandler);

// Global exception handling
process.on("uncaughtException", (error: Error) => {
    logger.error("Uncaught Exception", error);
});

process.on("unhandledRejection", (reason: unknown) => {
    logger.error("Unhandled Rejection", reason);
});

export default app;
