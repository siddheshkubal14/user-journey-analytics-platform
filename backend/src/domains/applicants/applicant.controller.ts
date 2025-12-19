import { Request, Response } from 'express';
import { ApplicantService } from './applicant.service';
import { createApplicantSchema, filterApplicantSchema } from './applicant.schema';
import { formattedResponse } from '../../shared/utils/response.util';

export class ApplicantController {
    static async getAll(req: Request, res: Response, next: Function) {
        try {
            const applicants = await ApplicantService.getAllApplicants();
            res.json(formattedResponse(applicants));
        } catch (err: any) {
            next(err);
        }
    }

    static async getById(req: Request, res: Response, next: Function) {
        try {
            const applicant = await ApplicantService.getApplicantById(req.params.id);
            if (!applicant) {
                const err = new Error('Applicant not found');
                (err as any).statusCode = 404;
                return next(err);
            }
            res.json(formattedResponse(applicant));
        } catch (err: any) {
            (err as any).statusCode = 400;
            next(err);
        }
    }

    static async create(req: Request, res: Response, next: Function) {
        try {
            const validated = createApplicantSchema.parse(req.body);
            const applicant = await ApplicantService.createApplicant(validated);
            res.status(201).json(formattedResponse(applicant, 'Applicant created'));
        } catch (err: any) {
            (err as any).statusCode = 400;
            next(err);
        }
    }

    static async filter(req: Request, res: Response, next: Function) {
        try {
            const filters = filterApplicantSchema.parse(req.query);
            const applicants = await ApplicantService.filterApplicants({
                userId: filters.userId,
                sessionId: filters.sessionId,
                actionType: filters.actionType,
                status: filters.status,
                from: filters.from ? new Date(filters.from) : undefined,
                to: filters.to ? new Date(filters.to) : undefined,
            });
            res.json(formattedResponse(applicants));
        } catch (err: any) {
            (err as any).statusCode = 400;
            next(err);
        }
    }
}
