import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../App";

export default function ProtectedRoute() {
    const { user, loadingUser } = useContext(AuthContext);

    if (loadingUser) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return <Outlet />;
}
