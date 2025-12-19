import { Request, Response } from 'express';
import { formattedResponse } from '../../shared/utils/response.util';
import { logger } from '../../shared/utils/logger.util';
import mongoose from 'mongoose';

export class HealthController {
    static async getHealth(req: Request, res: Response) {
        try {
            const mongoStatus = mongoose.connection.readyState;
            const mongoConnected = mongoStatus === 1; // 1 = connected

            const uptime = process.uptime();
            const memoryUsage = process.memoryUsage();

            const healthData = {
                status: mongoConnected ? 'healthy' : 'degraded',
                timestamp: new Date().toISOString(),
                services: {
                    mongodb: mongoConnected ? 'connected' : 'disconnected',
                    api: 'running'
                },
                system: {
                    uptime: Math.round(uptime),
                    memory: {
                        rss: Math.round(memoryUsage.rss / 1024 / 1024),
                        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
                        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
                        heapPercent: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
                        external: Math.round(memoryUsage.external / 1024 / 1024)
                    }
                }
            };

            logger.metric('health_check', healthData);

            res.status(mongoConnected ? 200 : 503).json(
                formattedResponse(healthData, mongoConnected ? 'Service is healthy' : 'Service degraded')
            );
        } catch (error: any) {
            logger.error('Health check error', { error: error.message });
            res.status(500).json(
                formattedResponse({ status: 'error' }, 'Health check failed')
            );
        }
    }

    static async getMetrics(req: Request, res: Response) {
        try {
            const memoryUsage = process.memoryUsage();
            const uptime = process.uptime();
            const cpuUsage = process.cpuUsage();

            const metrics = {
                timestamp: new Date().toISOString(),
                uptime: Math.round(uptime),
                memory: {
                    rss: Math.round(memoryUsage.rss / 1024 / 1024),
                    heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
                    heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
                    heapPercent: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
                    external: Math.round(memoryUsage.external / 1024 / 1024),
                    arrayBuffers: Math.round((memoryUsage.arrayBuffers || 0) / 1024 / 1024)
                },
                cpu: {
                    user: cpuUsage.user,
                    system: cpuUsage.system
                }
            };

            logger.metric('metrics_request', metrics);
            res.json(formattedResponse(metrics, 'Metrics retrieved successfully'));
        } catch (error: any) {
            logger.error('Metrics retrieval error', { error: error.message });
            res.status(500).json(
                formattedResponse({ error: 'Failed to retrieve metrics' }, 'Error')
            );
        }
    }

    static async getLiveness(req: Request, res: Response) {
        try {
            res.json(formattedResponse({ alive: true }, 'Service is alive'));
        } catch (error: any) {
            res.status(500).json(formattedResponse({ alive: false }, 'Service is not alive'));
        }
    }

    static async getReadiness(req: Request, res: Response) {
        try {
            const mongoStatus = mongoose.connection.readyState;
            const mongoConnected = mongoStatus === 1;

            if (!mongoConnected) {
                return res.status(503).json(
                    formattedResponse(
                        { ready: false, reason: 'Database not connected' },
                        'Service is not ready'
                    )
                );
            }

            res.json(formattedResponse({ ready: true }, 'Service is ready'));
        } catch (error: any) {
            res.status(500).json(
                formattedResponse({ ready: false, error: 'Readiness check failed' }, 'Error')
            );
        }
    }
}
