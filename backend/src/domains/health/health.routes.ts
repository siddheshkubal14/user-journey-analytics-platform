import { Router } from 'express';
import { HealthController } from './health.controller';

const router = Router();

router.get('/health', HealthController.getHealth);
router.get('/metrics', HealthController.getMetrics);
router.get('/live', HealthController.getLiveness);
router.get('/ready', HealthController.getReadiness);

export default router;
