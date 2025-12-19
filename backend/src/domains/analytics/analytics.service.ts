import { AnalyticsRepository, DailyKPI, UserAnalytics, SessionAnalytics, ConversionMetrics } from './analytics.repository';

export class AnalyticsService {
    static async getDailyKPIs(): Promise<DailyKPI[]> {
        return AnalyticsRepository.getDailyKPIs();
    }

    static async getUserAnalytics(): Promise<UserAnalytics> {
        return AnalyticsRepository.getUserAnalytics();
    }

    static async getSessionAnalytics(): Promise<SessionAnalytics> {
        return AnalyticsRepository.getSessionAnalytics();
    }

    static async getConversionMetrics(): Promise<ConversionMetrics> {
        return AnalyticsRepository.getConversionMetrics();
    }

    static async getTopPages(): Promise<{ page: string; visits: number }[]> {
        return AnalyticsRepository.getTopPages();
    }
}