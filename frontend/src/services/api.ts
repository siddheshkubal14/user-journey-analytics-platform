import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_KEY = import.meta.env.VITE_API_KEY || "";

const apiClient = axios.create({
    baseURL: API_BASE,
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    }
});
import type { CreateEventInput } from "../types";
export const getAllUsers = async () => {
    const res = await apiClient.get('/users');
    return res.data;
};

export const getUserById = async (userId: string) => {
    const res = await apiClient.get(`/users/${userId}`);
    return res.data;
};

export const searchUsers = async (
    query?: string,
    email?: string,
    page: number = 1,
    limit: number = 10
) => {
    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (email) params.append("email", email);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const res = await apiClient.get(`/users/search/query?${params}`);
    return res.data;
};

export const getUserAnalytics = async (userId: string) => {
    const res = await apiClient.get(`/users/analytics/${userId}`);
    return res.data;
};

export const getUserBehavior = async (
    userId: string,
    startDate?: string,
    endDate?: string
) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const res = await apiClient.get(`/users/behavior/${userId}?${params}`);
    return res.data;
};

export const getUserSessions = async (userId: string, page: number = 1, limit: number = 50) => {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));
    const res = await apiClient.get(`/sessions/user/${userId}?${params.toString()}`);
    return res.data;
};

export const getUserEvents = async (userId: string, page: number = 1, limit: number = 50) => {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));
    const res = await apiClient.get(`/events/user/${userId}?${params.toString()}`);
    return res.data;
};

export const createEvent = async (event: CreateEventInput) => {
    const res = await apiClient.post('/events', event);
    return res.data;
};

export const getKPIs = async () => {
    const res = await apiClient.get('/analytics/kpi');
    return res.data.data;
};

export const getUserAnalyticsData = async () => {
    const res = await apiClient.get('/analytics/users');
    return res.data.data;
};

export const getSessionAnalyticsData = async () => {
    const res = await apiClient.get('/analytics/sessions');
    return res.data.data;
};

export const getConversionMetrics = async () => {
    const res = await apiClient.get('/analytics/conversions');
    return res.data.data;
};

export const getTopPages = async () => {
    const res = await apiClient.get('/analytics/top-pages');
    return res.data.data;
};
