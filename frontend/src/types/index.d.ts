export interface Event {
    userId: string;
    eventType: string;
    page: string;
    duration: number;
    purchaseCount: number;
}

export interface Session {
    startTime: string;
    pagesVisited: number;
    timeSpent: number;
    purchaseCount: number;
}

export interface KPI {
    date: string;
    pageVisits: number;
    purchaseCount: number;
}

// Analytics Types
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

export interface TopPage {
    page: string;
    visits: number;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    statusCode: number;
}


export interface CreateEventInput {
    userId: string;
    eventType?: string;
    type?: string;
    page?: string;
    duration?: number;
    purchaseCount?: number;
}
