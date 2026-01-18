import Event from '../events/event.entity';
import Session from '../sessions/session.entity';
import User from '../users/user.entity';

export interface DailyKPI {
    date: string;
    pageVisits: number;
    purchaseCount: number;
    addToCartCount: number;
    activeSessions: number;
}

export interface UserAnalytics {
    totalUsers: number;
    newUsers: number;
    returningUsers: number;
}

export interface SessionAnalytics {
    averageSessionDuration: number;
    averagePagesPerSession: number;
    totalSessions: number;
}

export interface ConversionMetrics {
    cartToPageViewRatio: number;
    conversionRate: number;
}

export class AnalyticsRepository {
    static async getDailyKPIs(): Promise<DailyKPI[]> {
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Events pipeline (page views, purchases)
        const eventsData = await Event.aggregate([
            {
                $match: {
                    type: { $in: ['page_view', 'purchase'] },
                    timestamp: { $gte: thirtyDaysAgo, $lte: today }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                    pageVisits: { $sum: { $cond: [{ $eq: ['$type', 'page_view'] }, 1, 0] } },
                    purchaseCount: { $sum: { $cond: [{ $eq: ['$type', 'purchase'] }, 1, 0] } }
                }
            }
        ]);

        // Add to cart events pipeline
        const addToCartData = await Event.aggregate([
            {
                $match: {
                    type: 'add_to_cart',
                    timestamp: { $gte: thirtyDaysAgo, $lte: today }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                    addToCartCount: { $sum: 1 }
                }
            }
        ]);

        // Sessions pipeline (active sessions per day)
        const sessionsData = await Session.aggregate([
            {
                $match: {
                    sessionStart: { $gte: thirtyDaysAgo, $lte: today }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$sessionStart' } },
                    activeSessions: { $sum: 1 }
                }
            }
        ]);

        // Merge all data by date
        const dateMap = new Map<string, DailyKPI>();

        eventsData.forEach(item => {
            dateMap.set(item._id, {
                date: item._id,
                pageVisits: item.pageVisits,
                purchaseCount: item.purchaseCount,
                addToCartCount: 0,
                activeSessions: 0
            });
        });

        addToCartData.forEach(item => {
            const existing = dateMap.get(item._id) || {
                date: item._id,
                pageVisits: 0,
                purchaseCount: 0,
                addToCartCount: 0,
                activeSessions: 0
            };
            existing.addToCartCount = item.addToCartCount;
            dateMap.set(item._id, existing);
        });

        sessionsData.forEach(item => {
            const existing = dateMap.get(item._id) || {
                date: item._id,
                pageVisits: 0,
                purchaseCount: 0,
                addToCartCount: 0,
                activeSessions: 0
            };
            existing.activeSessions = item.activeSessions;
            dateMap.set(item._id, existing);
        });

        return Array.from(dateMap.values()).sort((a, b) => b.date.localeCompare(a.date));
    }

    static async getUserAnalytics(): Promise<UserAnalytics> {
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [totalUsers, newUsers] = await Promise.all([
            User.countDocuments({}),
            User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
        ]);

        return {
            totalUsers,
            newUsers,
            returningUsers: totalUsers - newUsers
        };
    }

    static async getSessionAnalytics(): Promise<SessionAnalytics> {
        const sessionStats = await Session.aggregate([
            {
                $group: {
                    _id: null,
                    averageSessionDuration: { $avg: '$timeSpent' },
                    averagePagesPerSession: { $avg: '$pagesVisited' },
                    totalSessions: { $sum: 1 }
                }
            }
        ]);

        const stats = sessionStats[0] || {
            averageSessionDuration: 0,
            averagePagesPerSession: 0,
            totalSessions: 0
        };

        return {
            averageSessionDuration: Math.round(stats.averageSessionDuration || 0),
            averagePagesPerSession: Math.round((stats.averagePagesPerSession || 0) * 100) / 100,
            totalSessions: stats.totalSessions || 0
        };
    }

    static async getConversionMetrics(): Promise<ConversionMetrics> {
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [pageViews, addToCartActions, purchases] = await Promise.all([
            Event.countDocuments({
                type: 'page_view',
                timestamp: { $gte: thirtyDaysAgo }
            }),
            Event.countDocuments({
                type: 'add_to_cart',
                timestamp: { $gte: thirtyDaysAgo }
            }),
            Event.countDocuments({
                type: 'purchase',
                timestamp: { $gte: thirtyDaysAgo }
            })
        ]);

        return {
            cartToPageViewRatio: pageViews > 0 ? Math.round((addToCartActions / pageViews) * 10000) / 100 : 0,
            conversionRate: addToCartActions > 0 ? Math.round((purchases / addToCartActions) * 10000) / 100 : 0
        };
    }

    static async getTopPages(): Promise<{ page: string; visits: number }[]> {
        return Event.aggregate([
            {
                $match: {
                    type: 'page_view',
                    page: { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: '$page',
                    visits: { $sum: 1 }
                }
            },
            {
                $project: {
                    page: '$_id',
                    visits: 1,
                    _id: 0
                }
            },
            { $sort: { visits: -1 } },
            { $limit: 10 }
        ]);
    }
}