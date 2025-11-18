import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
    const { user, token } = useContext(AuthContext);

    // Not logged in
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Role-based access check
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}
*/
