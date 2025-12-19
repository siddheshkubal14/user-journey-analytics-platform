import React, { useState, useRef } from "react";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "../services/api";
import "../styles/UserSearch.css";

interface User {
    _id: string;
    name: string;
    email: string;
}

interface SearchResult {
    users: User[];
    total: number;
    page: number;
    limit: number;
}

const UserSearch: React.FC = () => {
    const navigate = useNavigate();
    const resultsRef = useRef<HTMLDivElement | null>(null);
    const [query, setQuery] = useState("");
    const [email, setEmail] = useState("");
    const [results, setResults] = useState<SearchResult | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e?: React.FormEvent, page: number = 1) => {
        e?.preventDefault?.();

        if (!query && !email) {
            setError("Please enter a search query or email");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await searchUsers(query || undefined, email || undefined, page, 10);
            setResults(data.data);
            setCurrentPage(page);

            // Scroll to results after data loads
            requestAnimationFrame(() => {
                resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        } catch (err) {
            const message = isAxiosError(err)
                ? err.response?.data?.error || "Failed to search users"
                : "Failed to search users";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = (userId: string) => {
        navigate(`/user-behavior/${userId}`);
    };

    const totalPages = results ? Math.ceil(results.total / results.limit) : 0;

    return (
        <div className="user-search-container">
            <div className="search-header">
                <h1>User Search & Analytics</h1>
                <p>Find users and view their behavior analytics</p>
            </div>

            <form className="search-form" onSubmit={(e) => handleSearch(e, 1)}>
                <div className="form-group">
                    <label htmlFor="query">Search by Name</label>
                    <input
                        id="query"
                        type="text"
                        placeholder="Enter user name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Search by Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter email address..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                    />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {results && (
                <div className="results-section" ref={resultsRef}>
                    <h2>
                        Found {results.total} user{results.total !== 1 ? "s" : ""}
                    </h2>

                    {results.users.length === 0 ? (
                        <p className="no-results">No users found. Try a different search.</p>
                    ) : (
                        <>
                            <div className="users-grid">
                                {results.users.map((user) => (
                                    <div
                                        key={user._id}
                                        className="user-card"
                                        onClick={() => handleUserClick(user._id)}
                                    >
                                        <div className="user-avatar">
                                            {user.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </div>
                                        <h3>{user.name}</h3>
                                        <p>{user.email}</p>
                                        <button className="btn-view">
                                            View Behavior →
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="btn-pagination"
                                        onClick={() => handleSearch(undefined, currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        ← Previous
                                    </button>

                                    <span className="pagination-info">
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <button
                                        className="btn-pagination"
                                        onClick={() => handleSearch(undefined, currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {!results && !error && (
                <div className="initial-state">
                    <p>👤 Search for a user to view their behavior analytics</p>
                </div>
            )}
        </div>
    );
};

export default UserSearch;
