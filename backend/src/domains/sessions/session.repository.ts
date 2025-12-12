import Session, { ISession } from './session.entity';

export class SessionRepository {
    static async create(sessionData: Partial<ISession>): Promise<ISession> {
        const session = new Session(sessionData);
        return await session.save();
    }

    static async findAll(): Promise<ISession[]> {
        return await Session.find({});
    }

    static async findById(id: string): Promise<ISession | null> {
        return await Session.findById(id);
    }

    static async findByUserId(userId: string): Promise<ISession[]> {
        return await Session.find({ userId });
    }

    static async filter(filters: {
        userId?: string;
        from?: Date;
        to?: Date;
    }): Promise<ISession[]> {
        const query: any = {};
        if (filters.userId) query.userId = filters.userId;
        if (filters.from || filters.to) query.startTime = {};
        if (filters.from) query.startTime.$gte = filters.from;
        if (filters.to) query.startTime.$lte = filters.to;

        return await Session.find(query);
    }
}
