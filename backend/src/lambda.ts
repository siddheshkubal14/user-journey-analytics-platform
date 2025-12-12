import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import app from './app';

// AWS Lambda handler for API Gateway V2 (HTTP API)
export const handler: APIGatewayProxyHandlerV2 = serverlessExpress({
    app,
});
