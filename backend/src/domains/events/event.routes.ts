import { Router } from 'express';
import { EventController } from './event.controller';

const router = Router();

router.get('/user/:userId', EventController.getByUserId);
router.post('/', EventController.create);

export default router;
