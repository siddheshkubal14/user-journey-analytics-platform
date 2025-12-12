import { Request, Response } from 'express';
import app from './app';
import { logger } from './shared/utils/logger.util';

// Serverless Express wrapper for Lambda
const serverlessExpress = require('@vendia/serverless-express');

let cachedServer: any;

const createServer = () => {
    return serverlessExpress.createServer(app, undefined, [
        'application/json',
        'application/x-www-form-urlencoded',
    ]);
};

export const handler = async (event: any, context: any) => {
    logger.info('Lambda invoked', {
        path: event.rawPath,
        method: event.requestContext?.http?.method,
        sourceIp: event.requestContext?.http?.sourceIp,
    });

    if (!cachedServer) {
        cachedServer = createServer();
    }

    return cachedServer(event, context);
};
