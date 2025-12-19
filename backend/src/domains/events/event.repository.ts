import Event, { IEvent } from './event.entity';

export class EventRepository {
    static async create(eventData: Partial<IEvent>): Promise<IEvent> {
        const event = new Event(eventData);
        return await event.save();
    }

    static async findAll(page: number = 1, limit: number = 50): Promise<IEvent[]> {
        return await Event.find({})
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean() as unknown as IEvent[];
    }

    static async findById(id: string): Promise<IEvent | null> {
        return await Event.findById(id);
    }

    static async findByUserId(userId: string, page: number = 1, limit: number = 50): Promise<IEvent[]> {
        return await Event.find({ userId })
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean() as unknown as IEvent[];
    }

    static async findBySessionId(sessionId: string, page: number = 1, limit: number = 50): Promise<IEvent[]> {
        return await Event.find({ sessionId })
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean() as unknown as IEvent[];
    }

    static async findByType(type: string, page: number = 1, limit: number = 50): Promise<IEvent[]> {
        return await Event.find({ type })
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean() as unknown as IEvent[];
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

        return await Event.find(query)
            .sort({ timestamp: -1 })
            .lean() as unknown as IEvent[];
    }
}
