import { SessionRepository } from './session.repository';
import { ISession } from './session.entity';
import { CreateSessionInput } from './session.schema';
import { Types } from 'mongoose';

export class SessionService {
    static async createSession(data: CreateSessionInput): Promise<ISession> {
        const sessionStart = data.sessionStart ? new Date(data.sessionStart) : new Date();

        const validatedData: Partial<ISession> = {
            userId: new Types.ObjectId(data.userId),
            sessionStart,
            timeSpent: data.timeSpent || 0,
            pagesVisited: data.pagesVisited || 0,
        };

        return await SessionRepository.create(validatedData);
    }

    static async getAllSessions(): Promise<ISession[]> {
        return await SessionRepository.findAll();
    }

    static async getSessionById(id: string): Promise<ISession | null> {
        return await SessionRepository.findById(id);
    }

    static async getSessionsByUserId(userId: string): Promise<ISession[]> {
        return await SessionRepository.findByUserId(userId);
    }
}
