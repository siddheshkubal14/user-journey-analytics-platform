import { Router } from 'express';
import { ApplicantController } from './applicant.controller';

const router = Router();

router.get('/', ApplicantController.getAll);
router.get('/:id', ApplicantController.getById);
router.post('/', ApplicantController.create);
router.get('/filter', ApplicantController.filter);

export default router;
