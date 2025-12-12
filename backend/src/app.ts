import express, { Application } from 'express';

import cors from 'cors';
import sharedMiddleware from './shared/middleware';

import userRoutes from './domains/users/user.routes';
import sessionRoutes from './domains/sessions/session.routes';
import eventRoutes from './domains/events/event.routes';
import applicantRoutes from './domains/applicants/applicant.routes';
import filterRoutes from './domains/filters/filter.routes';
import { logger } from './shared/utils/logger.util';

const app: Application = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware
app.use(sharedMiddleware.requestLogger);

// Routes
app.use('/users', userRoutes);
app.use('/sessions', sessionRoutes);
app.use('/events', eventRoutes);
app.use('/applicants', applicantRoutes);
app.use('/filters', filterRoutes);


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
