import React, { useState } from "react";
import { createEvent } from "../services/api";
import type { CreateEventInput } from "../types";
import { isAxiosError } from "axios";
import "../styles/UserSearch.css";

const AddEvent: React.FC = () => {
    const [userId, setUserId] = useState("");
    const [eventType, setEventType] = useState("");
    const [page, setPage] = useState("");
    const [duration, setDuration] = useState(0);
    const [purchaseCount, setPurchaseCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const validateForm = (): string | null => {
        if (!userId.trim()) return "User ID is required";
        if (!eventType.trim()) return "Event Type is required";
        if (duration < 0) return "Duration cannot be negative";
        if (purchaseCount < 0) return "Purchase Count cannot be negative";
        if (!Number.isInteger(duration)) return "Duration must be a whole number";
        if (!Number.isInteger(purchaseCount)) return "Purchase Count must be a whole number";
        if (duration > 2147483647) return "Duration value too large";
        if (purchaseCount > 2147483647) return "Purchase Count value too large";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const payload: CreateEventInput = {
                userId: userId.trim(),
                eventType: eventType.trim(),
                page: page.trim() || undefined,
                duration: Math.floor(duration),
                purchaseCount: Math.floor(purchaseCount)
            };
            await createEvent(payload);
            setSuccess(true);
            setUserId("");
            setEventType("");
            setPage("");
            setDuration(0);
            setPurchaseCount(0);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            const message = isAxiosError(err)
                ? err.response?.data?.error || "Failed to create event"
                : "Failed to create event";
            setError(message);
        }
    };

    return (
        <div className="user-search-container">
            <div className="search-header">
                <h1>Add Event</h1>
                <p>Create a new user event for analytics tracking</p>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div style={{ background: 'rgba(40, 167, 69, 0.1)', border: '1px solid rgba(40, 167, 69, 0.3)', color: '#51cf66', padding: '1rem', borderRadius: '6px', marginBottom: '2rem' }}>Event created successfully!</div>}

            <form className="search-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="userId">User ID *</label>
                    <input
                        id="userId"
                        className="input-field"
                        placeholder="Enter user ID"
                        value={userId}
                        onChange={e => setUserId(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="eventType">Event Type *</label>
                    <input
                        id="eventType"
                        className="input-field"
                        placeholder="e.g., page_view, purchase, add_to_cart"
                        value={eventType}
                        onChange={e => setEventType(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="page">Page (optional)</label>
                    <input
                        id="page"
                        className="input-field"
                        placeholder="/home"
                        value={page}
                        onChange={e => setPage(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="duration">Duration (seconds, min: 0)</label>
                    <input
                        id="duration"
                        type="number"
                        className="input-field"
                        placeholder="0"
                        min="0"
                        step="1"
                        value={duration}
                        onChange={e => setDuration(Math.max(0, parseInt(e.target.value) || 0))}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="purchaseCount">Purchase Count (min: 0)</label>
                    <input
                        id="purchaseCount"
                        type="number"
                        className="input-field"
                        placeholder="0"
                        min="0"
                        step="1"
                        value={purchaseCount}
                        onChange={e => setPurchaseCount(Math.max(0, parseInt(e.target.value) || 0))}
                    />
                </div>

                <button type="submit" className="btn-primary">Submit Event</button>
            </form>
        </div>
    );
};

export default AddEvent;
