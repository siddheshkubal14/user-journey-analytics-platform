import { Request, Response } from 'express';
import { SessionService } from './session.service';
import { formattedResponse } from '../../shared/utils/response.util';

export class SessionController {
    static async getAll(req: Request, res: Response, next: Function) {
        try {
            const sessions = await SessionService.getAllSessions();
            res.json(formattedResponse(sessions));
        } catch (err: any) {
            next(err);
        }
    }

    static async getById(req: Request, res: Response, next: Function) {
        try {
            const session = await SessionService.getSessionById(req.params.id);
            if (!session) {
                const err = new Error('Session not found');
                (err as any).statusCode = 404;
                return next(err);
            }
            res.json(formattedResponse(session));
        } catch (err: any) {
            next(err);
        }
    }

    static async getByUserId(req: Request, res: Response, next: Function) {
        try {
            const sessions = await SessionService.getSessionsByUserId(req.params.userId);
            res.json(formattedResponse(sessions));
        } catch (err: any) {
            next(err);
        }
    }

    static async create(req: Request, res: Response, next: Function) {
        try {
            const session = await SessionService.createSession(req.body);
            res.status(201).json(formattedResponse(session, 'Session created'));
        } catch (err: any) {
            next(err);
        }
    }
}
