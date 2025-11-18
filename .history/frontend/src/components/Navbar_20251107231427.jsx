// frontend/src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b shadow-sm flex items-center justify-between px-6 py-3">
      <Link
        to="/"
        className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-green-500 bg-clip-text text-transparent"
      >
        MyHouseFinder
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-green-500 font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/search"
              className="text-gray-700 hover:text-pink-500 font-medium"
            >
              Search
            </Link>
            <Link
              to="/chat"
              className="text-gray-700 hover:text-green-500 font-medium"
            >
              Chat
            </Link>
            <button
              onClick={handleLogout}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition"
            >
              Logout
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
      </div>
    </nav>
  );
}
