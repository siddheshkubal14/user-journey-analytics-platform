import React, { useEffect, useState, useCallback } from "react";
import { isAxiosError } from "axios";
import { useParams } from "react-router-dom";
import { getUserBehavior } from "../services/api";
import BehaviorMetrics from "../components/behavior/BehaviorMetrics";
import EventTimeline from "../components/behavior/EventTimeline";
import PageAnalytics from "../components/behavior/PageAnalytics";
import "../styles/UserBehavior.css";

interface BehaviorEvent {
    _id: string;
    type: string;
    page?: string;
    itemId?: string;
    timestamp: string;
}

interface BehaviorPageData {
    page: string;
    pageViews: number;
    timeSpent: number;
    events: BehaviorEvent[];
}

interface BehaviorSession {
    sessionStart: string;
    sessionEnd?: string;
    pagesVisited: number;
    timeSpent: number;
}

interface BehaviorData {
    data: {
        userId: string;
        user: {
            _id: string;
            name: string;
            email: string;
        };
        dateRange: {
            startDate?: string;
            endDate?: string;
        };
        behavior: {
            totalSessions: number;
            totalEvents: number;
            totalTimeSpent: number;
            totalPagesVisited: number;
            purchaseCount: number;
            averageTimePerSession: number;
            averagePagesPerSession: number;
        };
        eventsByPage: BehaviorPageData[];
        sessionTimeline: BehaviorSession[];
        eventTimeline: BehaviorEvent[];
    };
}

const UserBehavior: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [data, setData] = useState<BehaviorData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState({
        startDate: "",
        endDate: "",
    });

    const fetchBehaviorData = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const result = await getUserBehavior(
                userId,
                dateRange.startDate || undefined,
                dateRange.endDate || undefined
            );
            setData(result);
        } catch (err) {
            const message = isAxiosError(err)
                ? err.response?.data?.error || "Failed to fetch user behavior"
                : "Failed to fetch user behavior";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [userId, dateRange.startDate, dateRange.endDate]);

    useEffect(() => {
        fetchBehaviorData();
    }, [fetchBehaviorData]);

    const handleDateRangeChange = () => {
        fetchBehaviorData();
    };

    if (loading) {
        return <div className="loading">Loading user behavior data...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!data) {
        return <div className="error">No data available</div>;
    }

    const user = data.data.user;
    const behavior = data.data.behavior;
    const eventsByPage = data.data.eventsByPage;
    const eventTimeline = data.data.eventTimeline;

    return (
        <div className="user-behavior-container">
            <div className="behavior-header">
                <div className="user-info">
                    <div className="avatar">
                        {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </div>
                    <div>
                        <h1>{user.name}</h1>
                        <p>{user.email}</p>
                    </div>
                </div>
            </div>

            <div className="filter-section">
                <h3>Filter by Date Range</h3>
                <div className="date-filter">
                    <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) =>
                            setDateRange({ ...dateRange, startDate: e.target.value })
                        }
                        placeholder="Start Date"
                        className="date-input"
                    />
                    <span>to</span>
                    <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) =>
                            setDateRange({ ...dateRange, endDate: e.target.value })
                        }
                        placeholder="End Date"
                        className="date-input"
                    />
                    <button
                        className="btn-filter"
                        onClick={handleDateRangeChange}
                    >
                        Apply Filter
                    </button>
                </div>
            </div>

            <BehaviorMetrics behavior={behavior} />

            {eventsByPage.length > 0 && (
                <PageAnalytics pages={eventsByPage} />
            )}

            {eventTimeline.length > 0 && (
                <EventTimeline events={eventTimeline} />
            )}

            {behavior.totalEvents === 0 && (
                <div className="no-data">
                    <p>No activity data available for this user in the selected date range.</p>
                </div>
            )}
        </div>
    );
};

export default UserBehavior;
