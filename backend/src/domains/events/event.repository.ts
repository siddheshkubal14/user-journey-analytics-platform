import Event, { IEvent } from './event.entity';

export class EventRepository {
    static async create(eventData: Partial<IEvent>): Promise<IEvent> {
        const event = new Event(eventData);
        return await event.save();
    }

    static async findAll(): Promise<IEvent[]> {
        return await Event.find({});
    }

    static async findById(id: string): Promise<IEvent | null> {
        return await Event.findById(id);
    }

    static async findByUserId(userId: string): Promise<IEvent[]> {
        return await Event.find({ userId });
    }

    static async findBySessionId(sessionId: string): Promise<IEvent[]> {
        return await Event.find({ sessionId });
    }

    static async findByType(type: string): Promise<IEvent[]> {
        return await Event.find({ type });
    }

    static async filter(filters: {
        userId?: string;
        sessionId?: string;
        eventType?: string;
        from?: Date;
        to?: Date;
    }): Promise<IEvent[]> {
        const query: any = {};
        if (filters.userId) query.userId = filters.userId;
        if (filters.sessionId) query.sessionId = filters.sessionId;
        if (filters.eventType) query.eventType = filters.eventType;
        if (filters.from || filters.to) query.timestamp = {};
        if (filters.from) query.timestamp.$gte = filters.from;
        if (filters.to) query.timestamp.$lte = filters.to;

        return await Event.find(query);
    }
}
