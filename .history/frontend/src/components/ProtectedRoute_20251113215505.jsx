// frontend/src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, token, loading } = useContext(AuthContext);

  // ⏳ Wait until authentication state is resolved
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Checking authentication...
      </div>
    );
  }

  // 🚫 If no token or user info, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 Role-based access control
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Option 1: Redirect unauthorized users to home
    return <Navigate to="/" replace />;

    // Option 2 (optional): Redirect to a dedicated Unauthorized page
    // return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Authorized: render the protected content
  return children;
}


