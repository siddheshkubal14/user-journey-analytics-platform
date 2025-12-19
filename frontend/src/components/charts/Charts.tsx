import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { DailyKPI } from "../../types";

interface ChartsProps {
    data: DailyKPI[] | null | undefined;
}

const Charts: React.FC<ChartsProps> = ({ data }) => {
    const chartData = Array.isArray(data) ? data : [];

    if (chartData.length === 0) {
        return <p style={{ textAlign: "center" }}>No data available to display</p>;
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pageVisits" stroke="#8884d8" name="Page Visits" />
                <Line type="monotone" dataKey="purchaseCount" stroke="#82ca9d" name="Purchases" />
                <Line type="monotone" dataKey="addToCartCount" stroke="#ffc658" name="Add to Cart" />
                <Line type="monotone" dataKey="activeSessions" stroke="#ff7300" name="Active Sessions" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default Charts;
