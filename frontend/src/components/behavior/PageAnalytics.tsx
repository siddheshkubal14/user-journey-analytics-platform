import React, { useState } from "react";
import "../../styles/PageAnalytics.css";

interface PageEvent {
    type: string;
    timestamp: string;
    itemId?: string;
}

interface PageData {
    page: string;
    pageViews: number;
    timeSpent: number;
    events: PageEvent[];
}

interface PageAnalyticsProps {
    pages: PageData[];
}

const PageAnalytics: React.FC<PageAnalyticsProps> = ({ pages }) => {
    const [expandedPage, setExpandedPage] = useState<string | null>(null);

    const sortedPages = [...pages].sort((a, b) => b.pageViews - a.pageViews);

    const maxPageViews = Math.max(...sortedPages.map((p) => p.pageViews), 1);

    return (
        <div className="page-analytics">
            <h2>Pages Visited & Activity</h2>
            <div className="pages-list">
                {sortedPages.map((page, index) => {
                    const percentage = (page.pageViews / maxPageViews) * 100;
                    const isExpanded = expandedPage === page.page;

                    return (
                        <div key={index} className="page-item">
                            <div
                                className="page-header"
                                onClick={() =>
                                    setExpandedPage(isExpanded ? null : page.page)
                                }
                            >
                                <div className="page-info">
                                    <h4>{page.page || "Unknown Page"}</h4>
                                    <p className="page-stats">
                                        {page.pageViews} view{page.pageViews !== 1 ? "s" : ""} •{" "}
                                        {page.events.length} event
                                        {page.events.length !== 1 ? "s" : ""}
                                    </p>
                                </div>
                                <div className="page-bar">
                                    <div
                                        className="page-bar-fill"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <span className="expand-icon">
                                    {isExpanded ? "▼" : "▶"}
                                </span>
                            </div>

                            {isExpanded && (
                                <div className="page-details">
                                    <div className="event-list">
                                        <h5>Recent Events on this Page:</h5>
                                        {page.events.slice(0, 5).map((event, eventIndex) => (
                                            <div key={eventIndex} className="event-item">
                                                <span className="event-type">
                                                    {event.type}
                                                </span>
                                                <span className="event-time">
                                                    {new Date(event.timestamp).toLocaleString()}
                                                </span>
                                                {event.itemId && (
                                                    <span className="event-item-id">
                                                        Item: {event.itemId}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                        {page.events.length > 5 && (
                                            <p className="more-events">
                                                +{page.events.length - 5} more events
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PageAnalytics;
