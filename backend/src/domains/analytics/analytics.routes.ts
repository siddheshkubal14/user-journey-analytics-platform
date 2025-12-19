import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';

const router = Router();

router.get('/kpi', AnalyticsController.getKPIs);
router.get('/users', AnalyticsController.getUserAnalytics);
router.get('/sessions', AnalyticsController.getSessionAnalytics);
router.get('/conversions', AnalyticsController.getConversionMetrics);
router.get('/top-pages', AnalyticsController.getTopPages);

export default router;