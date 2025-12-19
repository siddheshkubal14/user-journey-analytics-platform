import { UserRepository } from './user.repository';
import { IUser } from './user.entity';
import { CreateUserInput, SearchUserInput } from './user.schema';
import { ValidationUtil } from '../../shared/utils/validation.util';

export class UserService {
    static async createUser(data: CreateUserInput): Promise<IUser> {
        return await UserRepository.create(data);
    }

    static async getAllUsers(): Promise<IUser[]> {
        return await UserRepository.findAll();
    }

    static async getUserById(id: string): Promise<IUser | null> {
        return await UserRepository.findById(id);
    }

    static async getUserByEmail(email: string): Promise<IUser | null> {
        return await UserRepository.findByEmail(email);
    }

    static async searchUsers(params: SearchUserInput): Promise<{
        users: IUser[];
        total: number;
        page: number;
        limit: number;
    }> {
        const filter: any = {};

        if (params.query) {
            const sanitizedQuery = ValidationUtil.sanitizeString(params.query);
            filter.$or = [
                { name: { $regex: sanitizedQuery, $options: 'i' } },
                { email: { $regex: sanitizedQuery, $options: 'i' } },
            ];
        }

        if (params.email) {
            const sanitizedEmail = ValidationUtil.sanitizeString(params.email);
            filter.email = { $regex: sanitizedEmail, $options: 'i' };
        }

        const skip = (params.page - 1) * params.limit;
        const users = await UserRepository.findWithFilter(filter, skip, params.limit);
        const total = await UserRepository.countWithFilter(filter);

        return { users, total, page: params.page, limit: params.limit };
    }

    static async getUserAnalytics(userId: string): Promise<any> {
        const validUserId = ValidationUtil.validateString(userId, 'userId', 100);
        const user = await UserRepository.findById(validUserId);

        if (!user) {
            return null;
        }

        // Dynamically import event and session models for analytics
        const { EventService } = await import('../events/event.service');
        const { SessionService } = await import('../sessions/session.service');

        const userEvents = await EventService.getEventsByUserId(validUserId);
        const userSessions = await SessionService.getSessionsByUserId(validUserId);

        const purchases = userEvents.filter((e: any) => e.type === 'purchase').length;
        const pageViews = userEvents.filter((e: any) => e.type === 'page_view').length;
        const clicks = userEvents.filter((e: any) => e.type === 'click').length;

        return {
            user,
            analytics: {
                totalSessions: userSessions.length,
                totalEvents: userEvents.length,
                purchases,
                pageViews,
                clicks,
                lastActivityDate: userEvents[userEvents.length - 1]?.timestamp || null,
            },
            recentSessions: userSessions.slice(0, 5),
            recentEvents: userEvents.slice(0, 10),
        };
    }

    static async getUserBehavior(
        userId: string,
        startDate?: string,
        endDate?: string
    ): Promise<any> {
        try {
            const validUserId = ValidationUtil.validateString(userId, 'userId', 100);

            // Validate and parse date range if provided
            let dateRange: { start?: Date; end?: Date } = {};
            if (startDate || endDate) {
                if (startDate && endDate) {
                    dateRange = ValidationUtil.validateDateRange(startDate, endDate);
                } else {
                    if (startDate) dateRange.start = new Date(startDate);
                    if (endDate) dateRange.end = new Date(endDate);
                }
            }

            const user = await UserRepository.findById(validUserId);

            if (!user) {
                return null;
            }

            const { EventService } = await import('../events/event.service');
            const { SessionService } = await import('../sessions/session.service');

            let events = await EventService.getEventsByUserId(validUserId);
            let sessions = await SessionService.getSessionsByUserId(validUserId);

            // Filter by date range if provided
            if (dateRange.start || dateRange.end) {
                events = events.filter((e: any) => {
                    const eventDate = new Date(e.timestamp);
                    if (dateRange.start && eventDate < dateRange.start) return false;
                    if (dateRange.end && eventDate > dateRange.end) return false;
                    return true;
                });

                sessions = sessions.filter((s: any) => {
                    const sessionDate = new Date(s.sessionStart);
                    if (dateRange.start && sessionDate < dateRange.start) return false;
                    if (dateRange.end && sessionDate > dateRange.end) return false;
                    return true;
                });
            }

            // Group events by page
            const eventsByPage: any = {};
            events.forEach((event: any) => {
                const page = event.page || 'Unknown';
                if (!eventsByPage[page]) {
                    eventsByPage[page] = {
                        page,
                        pageViews: 0,
                        timeSpent: 0,
                        events: [],
                    };
                }
                eventsByPage[page].pageViews += 1;
                eventsByPage[page].events.push(event);
            });

            // Calculate behavior metrics
            const totalTimeSpent = sessions.reduce(
                (sum: number, s: any) => sum + (s.timeSpent || 0),
                0
            );

            const totalPagesVisited = sessions.reduce(
                (sum: number, s: any) => sum + (s.pagesVisited || 0),
                0
            );

            const purchases = events.filter((e: any) => e.type === 'purchase').length;

            return {
                userId: validUserId,
                user,
                dateRange: {
                    startDate: dateRange.start || startDate,
                    endDate: dateRange.end || endDate,
                },
                behavior: {
                    totalSessions: sessions.length,
                    totalEvents: events.length,
                    totalTimeSpent,
                    totalPagesVisited,
                    purchaseCount: purchases,
                    averageTimePerSession: sessions.length > 0 ? totalTimeSpent / sessions.length : 0,
                    averagePagesPerSession: sessions.length > 0 ? totalPagesVisited / sessions.length : 0,
                },
                eventsByPage: Object.values(eventsByPage),
                sessionTimeline: sessions
                    .sort((a: any, b: any) => new Date(b.sessionStart).getTime() - new Date(a.sessionStart).getTime())
                    .slice(0, 20),
                eventTimeline: events
                    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .slice(0, 50),
            };
        } catch (error: any) {
            throw new Error(`User behavior validation failed: ${error.message}`);
        }
    }
}
