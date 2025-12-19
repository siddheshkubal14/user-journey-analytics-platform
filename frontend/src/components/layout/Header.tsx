import React from "react";
import { NavLink } from "react-router-dom";
import "./layout.css";

const Header: React.FC = () => {
    return (
        <header className="app-header">
            <div className="brand">User Journey Analytics</div>
            <nav className="nav-links">
                <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    Dashboard
                </NavLink>
                <NavLink to="/search" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    User Search
                </NavLink>
                <NavLink to="/add-event" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    Add Event
                </NavLink>
            </nav>
        </header>
    );
};

export default Header;
