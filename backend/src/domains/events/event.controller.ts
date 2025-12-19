import { Request, Response } from 'express';
import { EventService } from './event.service';
import { createEventSchema, queryParamsSchema } from './event.schema';
import { formattedResponse } from '../../shared/utils/response.util';

export class EventController {
    static async getAll(req: Request, res: Response, next: Function) {
        try {
            const { page, limit } = queryParamsSchema.parse(req.query);
            const events = await EventService.getAllEvents(page, limit);
            res.json(formattedResponse(events));
        } catch (err: any) {
            (err as any).statusCode = 400;
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
            (err as any).statusCode = 400;
            next(err);
        }
    }

    static async getByUserId(req: Request, res: Response, next: Function) {
        try {
            const { page, limit } = queryParamsSchema.parse(req.query);
            const events = await EventService.getEventsByUserId(req.params.userId, page, limit);
            res.json(formattedResponse(events));
        } catch (err: any) {
            (err as any).statusCode = 400;
            next(err);
        }
    }

    static async getBySessionId(req: Request, res: Response, next: Function) {
        try {
            const { page, limit } = queryParamsSchema.parse(req.query);
            const events = await EventService.getEventsBySessionId(req.params.sessionId, page, limit);
            res.json(formattedResponse(events));
        } catch (err: any) {
            (err as any).statusCode = 400;
            next(err);
        }
    }

    static async create(req: Request, res: Response, next: Function) {
        try {
            const validated = createEventSchema.parse(req.body);
            // Normalize eventType → type, remove undefined/null fields
            const normalized: any = {
                userId: validated.userId,
                type: validated.type || (validated as any).eventType,
                duration: validated.duration,
                purchaseCount: validated.purchaseCount,
                page: validated.page,
                timestamp: validated.timestamp,
            };
            // Only include sessionId if provided and not null
            if (validated.sessionId) {
                normalized.sessionId = validated.sessionId;
            }
            const event = await EventService.createEvent(normalized);
            res.status(201).json(formattedResponse(event, 'Event created'));
        } catch (err: any) {
            (err as any).statusCode = 400;
            next(err);
        }
    }
}
