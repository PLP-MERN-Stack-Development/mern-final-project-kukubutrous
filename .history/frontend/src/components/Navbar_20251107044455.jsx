import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  MessageCircle,
  Search,
  User,
  LogOut,
  Sun,
  Moon,
  Shield,
  Users,
} from "lucide-react";
import api from "../utils/api";

const Navbar = ({ user, onLogout }) => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Enable persistent dark mode
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", darkMode ? "light" : "dark");
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      onLogout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <motion.nav
      className="sticky top-0 z-50 flex items-center justify-between bg-gradient-to-r from-green-500 to-green-700 dark:from-green-800 dark:to-green-900 text-white shadow-lg px-6 py-4"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Logo Section */}
      <Link
        to="/"
        className="flex items-center gap-2 text-2xl font-bold tracking-wide hover:scale-105 transition-transform"
      >
        <Users className="w-7 h-7" />
        <span>Roommate Finder</span>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-6 text-sm font-medium">
        <NavItem icon={<Home />} label="Dashboard" to="/dashboard" />
        <NavItem icon={<MessageCircle />} label="Chat" to="/chat" />
        <NavItem icon={<Search />} label="Search" to="/search" />
        <NavItem icon={<User />} label="Profile" to="/profile" />
        {user?.role === "admin" || user?.role === "superAdmin" ? (
          <NavItem icon={<Shield />} label="Admin" to="/admin" />
        ) : null}
        <NavItem icon={<MessageCircle />} label="Inbox" to="/inbox" />
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 bg-green-700 dark:bg-green-600 rounded-full hover:bg-green-800 transition"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-300" />
          ) : (
            <Moon className="w-5 h-5 text-gray-200" />
          )}
        </button>

        {/* Auth Buttons */}
        {user ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 bg-green-800 dark:bg-green-700 rounded-lg hover:bg-green-900 transition text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="px-3 py-2 bg-green-800 dark:bg-green-700 rounded-lg hover:bg-green-900 transition text-sm"
          >
            Sign In
          </Link>
        )}
      </div>
    </motion.nav>
  );
};

const NavItem = ({ icon, label, to }) => (
  <Link
    to={to}
    className="flex items-center gap-2 hover:text-green-200 transition-transform hover:scale-105"
  >
    <motion.span whileHover={{ rotate: 5, scale: 1.1 }}>{icon}</motion.span>
    {label}
  </Link>
);

export default Navbar;




/*
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

export default function Navbar() {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    }

    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-500 flex items-center justify-center text-white font-bold shadow">
                    RF
                </div>
                <div>
                    <div className="font-bold text-lg text-brand-700">Roommate Finder</div>
                    <div className="text-sm text-gray-600">Find your perfect roomie</div>
                </div>
            </div>

            <nav className="flex flex-col gap-2">
                <Link to="/dashboard" className="px-3 py-2 rounded hover:bg-brand-50">Dashboard</Link>
                <Link to="/chat" className="px-3 py-2 rounded hover:bg-brand-50">Chat</Link>
                <Link to="/inbox" className="px-3 py-2 rounded hover:bg-brand-50">Inbox</Link>
                <Link to="/search" className="px-3 py-2 rounded hover:bg-brand-50">Search</Link>
                <Link to="/profile" className="px-3 py-2 rounded hover:bg-brand-50">Profile</Link>
                <Link to="/admin" className="px-3 py-2 rounded hover:bg-brand-50">Admin</Link>

                <div className="mt-4 border-t pt-4">
                    {user ? (
                        <div>
                            <div className="text-sm text-gray-700 mb-2">Signed in as</div>
                            <div className="font-semibold">{user.firstName} {user.lastName}</div>
                            <button onClick={logout} className="mt-3 btn-brand w-full">Logout</button>
                        </div>
                    ) : (
                        <div>
                            <Link to="/login" className="btn-brand w-full text-center">Sign in</Link>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}
*/