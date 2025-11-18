





/*
//frontend/src/components/ProtectedRoute.jsx

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
    const { user, token, loading } = useContext(AuthContext);

    // Wait for auth state to load
    if (loading) {
        return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
    }

    // Not logged in → redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Role-based access control
    if (roles && user && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // Access granted
    return children;
}

*/