// frontend/src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-green-500 text-white p-4 flex justify-between items-center">
            <div className="text-xl font-bold">
                <Link to="/">Roommate Finder</Link>
            </div>

            <div className="space-x-4">
                {!user && (
                    <>
                        <Link to="/login" className="hover:underline">Login</Link>
                        <Link to="/register" className="hover:underline">Register</Link>
                    </>
                )}

                {user && (
                    <>
                        <Link to="/" className="hover:underline">Dashboard</Link>
                        <Link to="/search" className="hover:underline">Search</Link>
                        <Link to="/profile" className="hover:underline">Profile</Link>

                        {(user.role === "admin" || user.role === "superAdmin") && (
                            <Link to="/admin" className="hover:underline">Admin</Link>
                        )}

                        <button
                            onClick={handleLogout}
                            className="bg-white text-green-500 px-3 py-1 rounded hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}


/*  */ 