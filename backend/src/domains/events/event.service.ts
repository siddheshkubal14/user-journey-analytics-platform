import { EventRepository } from './event.repository';
import { IEvent } from './event.entity';
import { CreateEventInput } from './event.schema';
import { Types } from 'mongoose';
import { UserRepository } from '../users/user.repository';

export class EventService {
    static async createEvent(data: CreateEventInput): Promise<IEvent> {
        // Enforce referential integrity: user must exist
        const user = await UserRepository.findById(data.userId);
        if (!user) {
            const err: any = new Error('User not found');
            err.statusCode = 404;
            throw err;
        }

        const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();

        const validatedData: Partial<IEvent> = {
            userId: new Types.ObjectId(data.userId),
            type: data.type as any,
            duration: data.duration || 0,
            purchaseCount: data.purchaseCount || 0,
            sessionId: data.sessionId ? new Types.ObjectId(data.sessionId) : undefined,
            timestamp,
        };

        return await EventRepository.create(validatedData);
    }

    static async getAllEvents(page: number = 1, limit: number = 50): Promise<IEvent[]> {
        return await EventRepository.findAll(page, limit);
    }

    static async getEventById(id: string): Promise<IEvent | null> {
        return await EventRepository.findById(id);
    }

    static async getEventsByUserId(userId: string, page: number = 1, limit: number = 50): Promise<IEvent[]> {
        return await EventRepository.findByUserId(userId, page, limit);
    }

    static async getEventsBySessionId(sessionId: string, page: number = 1, limit: number = 50): Promise<IEvent[]> {
        return await EventRepository.findBySessionId(sessionId, page, limit);
    }

    static async getEventsByType(type: string, page: number = 1, limit: number = 50): Promise<IEvent[]> {
        return await EventRepository.findByType(type, page, limit);
    }
}
