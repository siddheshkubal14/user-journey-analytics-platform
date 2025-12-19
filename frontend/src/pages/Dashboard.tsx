import React, { useEffect, useState } from "react";
import {
    getKPIs,
    getUserAnalyticsData,
    getSessionAnalyticsData,
    getConversionMetrics,
    getTopPages
} from "../services/api";
import Charts from "../components/charts/Charts";
import type { DailyKPI, UserAnalytics, SessionAnalytics, ConversionMetrics, TopPage } from "../types/index";

interface DashboardData {
    kpis: DailyKPI[] | null;
    userAnalytics: UserAnalytics | null;
    sessionAnalytics: SessionAnalytics | null;
    conversionMetrics: ConversionMetrics | null;
    topPages: TopPage[] | null;
}

const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData>({
        kpis: null,
        userAnalytics: null,
        sessionAnalytics: null,
        conversionMetrics: null,
        topPages: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const [kpis, userAnalytics, sessionAnalytics, conversionMetrics, topPages] = await Promise.all([
                    getKPIs(),
                    getUserAnalyticsData(),
                    getSessionAnalyticsData(),
                    getConversionMetrics(),
                    getTopPages()
                ]);

                setData({
                    kpis,
                    userAnalytics,
                    sessionAnalytics,
                    conversionMetrics,
                    topPages
                });
            } catch (err) {
                setError('Failed to fetch analytics data');
                console.error('Dashboard data fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) {
        return <div><h1>Dashboard</h1><p>Loading analytics data...</p></div>;
    }

    if (error) {
        return <div><h1>Dashboard</h1><p>Error: {error}</p></div>;
    }

    // Filter KPIs by selected range (client-side)
    const filteredKpis: DailyKPI[] = Array.isArray(data.kpis)
        ? data.kpis.filter(k => {
            const kDate = new Date(k.date);
            const afterStart = startDate ? kDate >= new Date(startDate) : true;
            const beforeEnd = endDate ? kDate <= new Date(endDate) : true;
            return afterStart && beforeEnd;
        })
        : [];

    return (
        <div>
            <h1 style={{ marginBottom: '16px' }}>Analytics Dashboard</h1>

            <div className="section-card" style={{ marginBottom: '20px' }}>
                <h2 className="section-title">Daily KPIs</h2>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                    <div>
                        <label style={{ display: 'block', fontSize: 12, color: '#9fb1d3' }}>Start Date</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: 12, color: '#9fb1d3' }}>End Date</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <button onClick={() => { }}>
                        Apply
                    </button>
                </div>
                {filteredKpis.length > 0 ? <Charts data={filteredKpis} /> : <p>No KPI data in selected range</p>}
            </div>

            <div className="metrics-grid" style={{ marginBottom: '20px' }}>
                <div className="metric">
                    <div className="metric-label">Total Users</div>
                    <div className="metric-value">{data.userAnalytics?.totalUsers ?? '-'}</div>
                </div>
                <div className="metric">
                    <div className="metric-label">New Users (30d)</div>
                    <div className="metric-value">{data.userAnalytics?.newUsers ?? '-'}</div>
                </div>
                <div className="metric">
                    <div className="metric-label">Returning Users</div>
                    <div className="metric-value">{data.userAnalytics?.returningUsers ?? '-'}</div>
                </div>
                <div className="metric">
                    <div className="metric-label">Total Sessions</div>
                    <div className="metric-value">{data.sessionAnalytics?.totalSessions ?? '-'}</div>
                </div>
                <div className="metric">
                    <div className="metric-label">Avg Session Duration (s)</div>
                    <div className="metric-value">{data.sessionAnalytics?.averageSessionDuration ?? '-'}</div>
                </div>
                <div className="metric">
                    <div className="metric-label">Avg Pages / Session</div>
                    <div className="metric-value">{data.sessionAnalytics?.averagePagesPerSession ?? '-'}</div>
                </div>
                <div className="metric">
                    <div className="metric-label">Cart → Page Ratio (%)</div>
                    <div className="metric-value">{data.conversionMetrics?.cartToPageViewRatio ?? '-'}</div>
                </div>
                <div className="metric">
                    <div className="metric-label">Conversion Rate (%)</div>
                    <div className="metric-value">{data.conversionMetrics?.conversionRate ?? '-'}</div>
                </div>
            </div>

            <div className="section-card" style={{ marginBottom: '20px' }}>
                <h2 className="section-title">Top Pages</h2>
                {data.topPages && data.topPages.length > 0 ? (
                    <ul className="simple-list">
                        {data.topPages.map((page, index) => (
                            <li key={index}>{page.page}: {page.visits} visits</li>
                        ))}
                    </ul>
                ) : <p>No top pages data available</p>}
            </div>
        </div>
    );
};

export default Dashboard;
