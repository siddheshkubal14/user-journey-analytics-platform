import { SessionRepository } from './session.repository';
import { ISession } from './session.entity';

export class SessionService {
    static async createSession(data: Partial<ISession>): Promise<ISession> {
        // Add business logic if needed
        return await SessionRepository.create(data);
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
