import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';
import { formattedResponse } from '../../shared/utils/response.util';

export class AnalyticsController {
    static async getKPIs(req: Request, res: Response, next: Function) {
        try {
            const kpis = await AnalyticsService.getDailyKPIs();
            res.json(formattedResponse(kpis));
        } catch (err: any) {
            next(err);
        }
    }

    static async getUserAnalytics(req: Request, res: Response, next: Function) {
        try {
            const userAnalytics = await AnalyticsService.getUserAnalytics();
            res.json(formattedResponse(userAnalytics));
        } catch (err: any) {
            next(err);
        }
    }

    static async getSessionAnalytics(req: Request, res: Response, next: Function) {
        try {
            const sessionAnalytics = await AnalyticsService.getSessionAnalytics();
            res.json(formattedResponse(sessionAnalytics));
        } catch (err: any) {
            next(err);
        }
    }

    static async getConversionMetrics(req: Request, res: Response, next: Function) {
        try {
            const conversionMetrics = await AnalyticsService.getConversionMetrics();
            res.json(formattedResponse(conversionMetrics));
        } catch (err: any) {
            next(err);
        }
    }

    static async getTopPages(req: Request, res: Response, next: Function) {
        try {
            const topPages = await AnalyticsService.getTopPages();
            res.json(formattedResponse(topPages));
        } catch (err: any) {
            next(err);
        }
    }
}