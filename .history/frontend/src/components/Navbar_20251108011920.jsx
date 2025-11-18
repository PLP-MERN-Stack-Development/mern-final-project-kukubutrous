import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { User, LogOut, Menu, X, Shield, Users } from "lucide-react";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 relative">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-green-500 bg-clip-text text-transparent"
                >
                    MyHouseFinder
                </Link>

                {/* Desktop Links */}
                <ul className="hidden md:flex items-center gap-6">
                    {user ? (
                        <>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    `font-medium transition ${isActive
                                        ? "text-green-500"
                                        : "text-gray-700 hover:text-green-500"
                                    }`
                                }
                            >
                                Dashboard
                            </NavLink>

                            <NavLink
                                to="/search"
                                className={({ isActive }) =>
                                    `font-medium transition ${isActive
                                        ? "text-pink-500"
                                        : "text-gray-700 hover:text-pink-500"
                                    }`
                                }
                            >
                                Search
                            </NavLink>

                            <NavLink
                                to="/chat"
                                className={({ isActive }) =>
                                    `font-medium transition ${isActive
                                        ? "text-green-500"
                                        : "text-gray-700 hover:text-green-500"
                                    }`
                                }
                            >
                                Chat
                            </NavLink>

                            {/* Admin / SuperAdmin Dropdown */}
                            {(user?.role === "admin" || user?.role === "superAdmin") && (
                                <div
                                    className="relative"
                                    onMouseEnter={() => setAdminMenuOpen(true)}
                                    onMouseLeave={() => setAdminMenuOpen(false)}
                                >
                                    <button className="flex items-center gap-2 text-gray-700 hover:text-pink-500 font-medium transition">
                                        <Shield className="w-4 h-4 text-pink-500" />
                                        Admin Panel
                                    </button>
                                    {adminMenuOpen && (
                                        <motion.ul
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-10"
                                        >
                                            {user?.role === "admin" && (
                                                <li>
                                                    <Link
                                                        to="/admin"
                                                        className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                                                    >
                                                        <Users className="inline w-4 h-4 mr-1" />
                                                        Admin Dashboard
                                                    </Link>
                                                </li>
                                            )}
                                            {user?.role === "superAdmin" && (
                                                <>
                                                    <li>
                                                        <Link
                                                            to="/admin"
                                                            className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                                                        >
                                                            <Users className="inline w-4 h-4 mr-1" />
                                                            Admin Dashboard
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            to="/superadmin"
                                                            className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                                                        >
                                                            <Shield className="inline w-4 h-4 mr-1" />
                                                            SuperAdmin
                                                        </Link>
                                                    </li>
                                                </>
                                            )}
                                        </motion.ul>
                                    )}
                                </div>
                            )}

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="bg-gradient-to-r from-green-500 to-pink-500 text-white px-4 py-2 rounded-full hover:opacity-90 transition flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </ul>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gray-600"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden bg-white border-t shadow-sm p-4 space-y-4"
                >
                    {user ? (
                        <>
                            <NavLink
                                to="/dashboard"
                                onClick={() => setMenuOpen(false)}
                                className="block text-gray-700 hover:text-green-500 font-medium"
                            >
                                Dashboard
                            </NavLink>
                            <NavLink
                                to="/search"
                                onClick={() => setMenuOpen(false)}
                                className="block text-gray-700 hover:text-pink-500 font-medium"
                            >
                                Search
                            </NavLink>
                            <NavLink
                                to="/chat"
                                onClick={() => setMenuOpen(false)}
                                className="block text-gray-700 hover:text-green-500 font-medium"
                            >
                                Chat
                            </NavLink>

                            {(user?.role === "admin" || user?.role === "superAdmin") && (
                                <div className="border-t pt-2">
                                    <p className="text-sm font-semibold text-gray-600 mb-2">
                                        Admin Controls
                                    </p>
                                    <NavLink
                                        to="/admin"
                                        onClick={() => setMenuOpen(false)}
                                        className="block text-gray-700 hover:text-pink-500 text-sm mb-1"
                                    >
                                        Admin Dashboard
                                    </NavLink>
                                    {user?.role === "superAdmin" && (
                                        <NavLink
                                            to="/superadmin"
                                            onClick={() => setMenuOpen(false)}
                                            className="block text-gray-700 hover:text-green-500 text-sm"
                                        >
                                            SuperAdmin
                                        </NavLink>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMenuOpen(false);
                                }}
                                className="w-full bg-gradient-to-r from-green-500 to-pink-500 text-white py-2 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                                className="block bg-green-500 text-white px-4 py-2 rounded-full text-center hover:bg-green-600 transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setMenuOpen(false)}
                                className="block bg-pink-500 text-white px-4 py-2 rounded-full text-center hover:bg-pink-600 transition"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </motion.div>
            )}
        </nav>
    );
}
