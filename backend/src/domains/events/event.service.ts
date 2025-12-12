import { EventRepository } from './event.repository';
import { IEvent } from './event.entity';

export class EventService {
    static async createEvent(data: Partial<IEvent>): Promise<IEvent> {
        // Business logic could go here, e.g., filtering invalid types
        return await EventRepository.create(data);
    }

    static async getAllEvents(): Promise<IEvent[]> {
        return await EventRepository.findAll();
    }

    static async getEventById(id: string): Promise<IEvent | null> {
        return await EventRepository.findById(id);
    }

    static async getEventsByUserId(userId: string): Promise<IEvent[]> {
        return await EventRepository.findByUserId(userId);
    }

    static async getEventsBySessionId(sessionId: string): Promise<IEvent[]> {
        return await EventRepository.findBySessionId(sessionId);
    }

    static async getEventsByType(type: string): Promise<IEvent[]> {
        return await EventRepository.findByType(type);
    }
}
