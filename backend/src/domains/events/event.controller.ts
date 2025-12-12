import { Request, Response } from 'express';
import { EventService } from './event.service';
import { formattedResponse } from '../../shared/utils/response.util';

export class EventController {
    static async getAll(req: Request, res: Response, next: Function) {
        try {
            // validation can be added here
            const events = await EventService.getAllEvents();
            res.json(formattedResponse(events));
        } catch (err: any) {
            next(err);
        }
    }

    static async getById(req: Request, res: Response, next: Function) {
        try {
            const event = await EventService.getEventById(req.params.id);
            if (!event) {
                const err = new Error('Event not found');
                (err as any).statusCode = 404;
                return next(err);
            }
            res.json(formattedResponse(event));
        } catch (err: any) {
            next(err);
        }
    }

    static async getByUserId(req: Request, res: Response, next: Function) {
        try {
            const events = await EventService.getEventsByUserId(req.params.userId);
            res.json(formattedResponse(events));
        } catch (err: any) {
            next(err);
        }
    }

    static async getBySessionId(req: Request, res: Response, next: Function) {
        try {
            const events = await EventService.getEventsBySessionId(req.params.sessionId);
            res.json(formattedResponse(events));
        } catch (err: any) {
            next(err);
        }
    }

    static async create(req: Request, res: Response, next: Function) {
        try {
            const event = await EventService.createEvent(req.body);
            res.status(201).json(formattedResponse(event, 'Event created'));
        } catch (err: any) {
            next(err);
        }
    }
}
