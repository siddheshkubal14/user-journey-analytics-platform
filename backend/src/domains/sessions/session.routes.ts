import { Router } from 'express';
import { SessionController } from './session.controller';

const router = Router();

router.get('/', SessionController.getAll);
router.get('/:id', SessionController.getById);
router.get('/user/:userId', SessionController.getByUserId);
router.post('/', SessionController.create);

export default router;
