import React from "react";
import { Routes as Switch, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import UserDetail from "../pages/UserDetail";
import AddEvent from "../pages/AddEvent";
import UserSearch from "../pages/UserSearch";
import UserBehavior from "../pages/UserBehavior";

const Routes: React.FC = () => (
    <Switch>
        <Route path="/" element={<Dashboard />} />
        <Route path="/user/:id" element={<UserDetail />} />
        <Route path="/add-event" element={<AddEvent />} />
        <Route path="/search" element={<UserSearch />} />
        <Route path="/user-behavior/:userId" element={<UserBehavior />} />
    </Switch>
);

export default Routes;
