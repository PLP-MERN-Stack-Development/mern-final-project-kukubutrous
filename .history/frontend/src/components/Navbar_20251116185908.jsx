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
        <nav className="bg-green text-white px-20 py-10 shadow-md flex flex-wrap gap-50 items-center">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-10">

                {/* Brand */}
                <Link
                    to="/"
                    className="text-2xl font-bold tracking-wide hover:text-gray-200 transition"
                >
                    Roommate Finder
                </Link>

                {/* Right side links */}
                <div className="flex flex-wrap items-center gap-50 text-sm md:text-base">

                    {/* Public links */}
                    {!user && (
                        <>
                            <Link
                                to="/login"
                                className="hover:text-gray-200 transition px-25 py-1.5"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="hover:text-gray-200 transition px-25 py-1.5"
                            >
                                Register
                            </Link>
                        </>
                    )}

                    {/* Authenticated user links */}
                    {user && (
                        <>
                            <Link
                                to="/"
                                className="bg-green-800 hover:text-gray-200 transition px-25 py-1.5"
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/search"
                                className="hover:text-gray-200 transition px-25 py-1.5"
                            >
                                Search
                            </Link>

                            <Link
                                to="/profile"
                                className="hover:text-gray-200 transition px-25 py-1.5"
                            >
                                Profile
                            </Link>

                            {/* Chat link */}
                            <Link
                                to="/chats"
                                className="hover:text-gray-200 px-25 py-1.5 transition"
                            >
                                Chat
                            </Link>

                            {(isAdmin || isSuperAdmin) && (
                                <Link
                                    to="/admin"
                                    className="hover:text-gray-200 transition"
                                >
                                    Admin Panel
                                </Link>
                            )}

                            {isSuperAdmin && (
                                <Link
                                    to="/admin/roles"
                                    className="hover:text-gray-200 transition"
                                >
                                    Manage Roles
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="bg-white text-green-700 font-semibold px-4 py-1.5 rounded-md hover:bg-gray-100 transition"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

