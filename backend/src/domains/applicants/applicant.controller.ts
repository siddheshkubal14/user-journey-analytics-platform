import { Request, Response } from 'express';
import { ApplicantService } from './applicant.service';
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
            next(err);
        }
    }

    static async create(req: Request, res: Response, next: Function) {
        try {
            const applicant = await ApplicantService.createApplicant(req.body);
            res.status(201).json(formattedResponse(applicant, 'Applicant created'));
        } catch (err: any) {
            next(err);
        }
    }

    static async filter(req: Request, res: Response, next: Function) {
        try {
            const filters = req.query;
            const applicants = await ApplicantService.filterApplicants({
                userId: filters.userId as string,
                sessionId: filters.sessionId as string,
                actionType: filters.actionType as string,
                status: filters.status as string,
                from: filters.from ? new Date(filters.from as string) : undefined,
                to: filters.to ? new Date(filters.to as string) : undefined,
            });
            res.json(formattedResponse(applicants));
        } catch (err: any) {
            next(err);
        }
    }
}
