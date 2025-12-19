import React from "react";
import "../../styles/EventTimeline.css";

interface Event {
    _id: string;
    type: string;
    page?: string;
    itemId?: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
}

interface EventTimelineProps {
    events: Event[];
}

const EventTimeline: React.FC<EventTimelineProps> = ({ events }) => {
    const getEventIcon = (type: string): string => {
        const iconMap: Record<string, string> = {
            purchase: "🛒",
            page_view: "📄",
            click: "🖱️",
            add_to_cart: "🛍️",
            search: "🔍",
            login: "🔐",
            logout: "🚪",
            form_submit: "📝",
            error: "❌",
        };
        return iconMap[type] || "📌";
    };

    const getEventColor = (type: string): string => {
        const colorMap: Record<string, string> = {
            purchase: "event-red",
            page_view: "event-blue",
            click: "event-purple",
            add_to_cart: "event-green",
            search: "event-orange",
            login: "event-teal",
            logout: "event-gray",
            form_submit: "event-indigo",
            error: "event-red",
        };
        return colorMap[type] || "event-gray";
    };

    const sortedEvents = [...events].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return (
        <div className="event-timeline">
            <h2>Event Timeline</h2>
            <div className="timeline-container">
                {sortedEvents.map((event, index) => {
                    const eventDate = new Date(event.timestamp);
                    const isToday = new Date().toDateString() === eventDate.toDateString();
                    const dateLabel = isToday
                        ? "Today"
                        : eventDate.toLocaleDateString();

                    return (
                        <div key={event._id} className="timeline-item">
                            <div className="timeline-marker">
                                <div className={`timeline-dot ${getEventColor(event.type)}`}>
                                    {getEventIcon(event.type)}
                                </div>
                                {index !== sortedEvents.length - 1 && (
                                    <div className="timeline-line"></div>
                                )}
                            </div>

                            <div className="timeline-content">
                                <div className="event-header">
                                    <span className="event-type">{event.type}</span>
                                    <span className="event-date">
                                        {dateLabel} at{" "}
                                        {eventDate.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>

                                <div className="event-details">
                                    {event.page && (
                                        <p>
                                            <strong>Page:</strong> {event.page}
                                        </p>
                                    )}
                                    {event.itemId && (
                                        <p>
                                            <strong>Item:</strong> {event.itemId}
                                        </p>
                                    )}
                                    {event.metadata &&
                                        Object.keys(event.metadata).length > 0 && (
                                            <details>
                                                <summary>Additional Details</summary>
                                                <pre>
                                                    {JSON.stringify(
                                                        event.metadata,
                                                        null,
                                                        2
                                                    )}
                                                </pre>
                                            </details>
                                        )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EventTimeline;
