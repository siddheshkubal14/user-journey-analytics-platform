import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();

router.get('/search/query', UserController.searchUsers);
router.get('/analytics/:userId', UserController.getUserAnalytics);
router.get('/behavior/:userId', UserController.getUserBehavior);
router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.post('/', UserController.create);

export default router;
