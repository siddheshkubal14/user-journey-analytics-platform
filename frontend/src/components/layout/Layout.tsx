import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "./Header";
import "./layout.css";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();

    const breadcrumbs = useMemo(() => {
        const labelMap: Record<string, string> = {
            "": "Dashboard",
            search: "User Search",
            "add-event": "Add Event",
            user: "User",
            "user-behavior": "User Behavior",
        };

        const looksLikeId = (segment: string) => /^[a-f0-9]{8,}$/i.test(segment);

        const segments = location.pathname.split("/").filter(Boolean);
        const crumbs = [] as { label: string; path: string }[];

        segments.forEach((segment, idx) => {
            if (looksLikeId(segment)) {
                return;
            }

            const path = `/${segments.slice(0, idx + 1).join("/")}`;
            const label = labelMap[segment] || segment;
            crumbs.push({ label, path });
        });

        // Always ensure Dashboard root first
        return [{ label: "Dashboard", path: "/" }, ...crumbs];
    }, [location.pathname]);

    return (
        <div className="app-shell">
            <Header />
            <div className="breadcrumb-bar">
                {breadcrumbs.map((crumb, idx) => {
                    const isLast = idx === breadcrumbs.length - 1;
                    return (
                        <span key={crumb.path} className="breadcrumb-item">
                            {isLast ? (
                                <span className="breadcrumb-current">{crumb.label}</span>
                            ) : (
                                <Link to={crumb.path} className="breadcrumb-link">
                                    {crumb.label}
                                </Link>
                            )}
                            {idx < breadcrumbs.length - 1 && <span className="breadcrumb-separator">/</span>}
                        </span>
                    );
                })}
            </div>
            <main className="app-content">{children}</main>
        </div>
    );
};

export default Layout;
