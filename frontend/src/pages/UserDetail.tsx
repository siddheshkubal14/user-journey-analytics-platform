import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserSessions, getUserEvents } from "../services/api";
import type { Session } from "../types";

type EventLike = {
    type?: string;
    eventType?: string;
    timestamp?: string;
    page?: string;
};

const UserDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [events, setEvents] = useState<EventLike[]>([]);
    const [pageSessions, setPageSessions] = useState(1);
    const [pageEvents, setPageEvents] = useState(1);
    const limit = 20;

    useEffect(() => {
        if (!id) return;
        getUserSessions(id, pageSessions, limit).then((res) => setSessions(res.data)).catch(console.error);
    }, [id, pageSessions]);

    useEffect(() => {
        if (!id) return;
        getUserEvents(id, pageEvents, limit).then((res) => setEvents(res.data)).catch(console.error);
    }, [id, pageEvents]);

    return (
        <div>
            <h1>User Detail: {id}</h1>

            <h2>Sessions</h2>
            {sessions.map((s, i) => (
                <div key={i}>
                    <p>Session start: {(s as Partial<Session> & { startTime?: string }).startTime || s.startTime}</p>
                    <p>Pages visited: {s.pagesVisited}</p>
                    <p>Time spent: {s.timeSpent} secs</p>
                </div>
            ))}
            <div style={{ display: 'flex', gap: 8, margin: '8px 0 24px' }}>
                <button onClick={() => setPageSessions(Math.max(1, pageSessions - 1))} disabled={pageSessions === 1}>Prev</button>
                <span>Page {pageSessions}</span>
                <button onClick={() => setPageSessions(pageSessions + 1)}>Next</button>
            </div>

            <h2>Events</h2>
            {events.map((e, i) => (
                <div key={i}>
                    <p>{e.type || e.eventType} at {e.timestamp} {e.page ? `on ${e.page}` : ''}</p>
                </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={() => setPageEvents(Math.max(1, pageEvents - 1))} disabled={pageEvents === 1}>Prev</button>
                <span>Page {pageEvents}</span>
                <button onClick={() => setPageEvents(pageEvents + 1)}>Next</button>
            </div>
        </div>
    );
};

export default UserDetail;
