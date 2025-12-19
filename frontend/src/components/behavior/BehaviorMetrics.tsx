import React from "react";
import "../../styles/BehaviorMetrics.css";

interface BehaviorMetricsProps {
    behavior: {
        totalSessions: number;
        totalEvents: number;
        totalTimeSpent: number;
        totalPagesVisited: number;
        purchaseCount: number;
        averageTimePerSession: number;
        averagePagesPerSession: number;
    };
}

const BehaviorMetrics: React.FC<BehaviorMetricsProps> = ({ behavior }) => {
    const formatTime = (seconds: number): string => {
        if (seconds < 60) return `${Math.round(seconds)}s`;
        if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
        return `${Math.round(seconds / 3600)}h`;
    };

    const metrics = [
        {
            label: "Total Sessions",
            value: behavior.totalSessions,
            color: "blue",
        },
        {
            label: "Total Events",
            value: behavior.totalEvents,
            color: "purple",
        },
        {
            label: "Total Time Spent",
            value: formatTime(behavior.totalTimeSpent),
            color: "orange",
        },
        {
            label: "Pages Visited",
            value: behavior.totalPagesVisited,
            color: "green",
        },
        {
            label: "Purchases",
            value: behavior.purchaseCount,
            color: "red",
        },
        {
            label: "Avg Time/Session",
            value: formatTime(behavior.averageTimePerSession),
            color: "teal",
        },
        {
            label: "Avg Pages/Session",
            value: behavior.averagePagesPerSession.toFixed(2),
            color: "indigo",
        },
    ];

    return (
        <div className="behavior-metrics">
            <h2>User Behavior Metrics</h2>
            <div className="metrics-grid">
                {metrics.map((metric, index) => (
                    <div key={index} className={`metric-card metric-${metric.color}`}>
                        <div className="metric-content">
                            <p className="metric-label">{metric.label}</p>
                            <p className="metric-value">{metric.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BehaviorMetrics;
