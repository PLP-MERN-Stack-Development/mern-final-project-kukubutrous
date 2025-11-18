






/*
// frontend/src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
    const { user, logout, isAdmin, isSuperAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-green-600 text-white px-6 py-3 flex flex-wrap justify-between items-center shadow-md">
            {/* Logo / Brand *}
            <div className="text-2xl font-bold tracking-wide hover:text-gray-200 transition">
                <Link to="/">Roommate Finder</Link>
            </div>

            {/* Right Section (Links) *}
            <div className="flex flex-wrap items-center space-x-4 text-sm md:text-base">
                {/* ---------- Public Links ---------- *}
                {!user && (
                    <>
                        <Link
                            to="/login"
                            className="hover:underline hover:text-gray-200 transition"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="hover:underline hover:text-gray-200 transition"
                        >
                            Register
                        </Link>
                    </>
                )}

                {/* ---------- Authenticated User Links ---------- *}
                {user && (
                    <>
                        <Link
                            to="/"
                            className="hover:underline hover:text-gray-200 transition"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/search"
                            className="hover:underline hover:text-gray-200 transition"
                        >
                            Search
                        </Link>

                        <Link
                            to="/profile"
                            className="hover:underline hover:text-gray-200 transition"
                        >
                            Profile
                        </Link>

                        {/* ---------- Admin / SuperAdmin ---------- *}
                        {(isAdmin || isSuperAdmin) && (
                            <Link
                                to="/admin"
                                className="hover:underline hover:text-gray-200 transition"
                            >
                                Admin Panel
                            </Link>
                        )}

                        {/* ---------- SuperAdmin Only ---------- *}
                        {isSuperAdmin && (
                            <Link
                                to="/admin/roles"
                                className="hover:underline hover:text-gray-200 transition"
                            >
                                Manage Roles
                            </Link>
                        )}

                        {/* ---------- Logout Button ---------- *}
                        <button
                            onClick={handleLogout}
                            className="bg-white text-green-600 font-semibold px-3 py-1 rounded-md hover:bg-gray-100 transition"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
*/