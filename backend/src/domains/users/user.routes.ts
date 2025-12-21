import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();

router.get('/search/query', UserController.searchUsers);
router.get('/behavior/:userId', UserController.getUserBehavior);

export default router;
