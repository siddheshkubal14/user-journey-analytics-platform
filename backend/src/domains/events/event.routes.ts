import { Router } from 'express';
import { EventController } from './event.controller';

const router = Router();

router.get('/', EventController.getAll);
router.get('/:id', EventController.getById);
router.get('/user/:userId', EventController.getByUserId);
router.get('/session/:sessionId', EventController.getBySessionId);
router.post('/', EventController.create);

export default router;
