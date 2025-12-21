import { Router } from 'express';
import { SessionController } from './session.controller';

const router = Router();

router.get('/user/:userId', SessionController.getByUserId);

export default router;
