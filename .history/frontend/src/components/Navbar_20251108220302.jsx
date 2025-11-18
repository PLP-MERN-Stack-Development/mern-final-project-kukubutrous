import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-green-500 text-white p-4 flex justify-between">
      <Link to="/dashboard" className="font-bold text-lg">Roommate Finder</Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span>{user.name}</span>
            <button onClick={handleLogout} className="bg-white text-green-500 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <Link to="/login" className="bg-white text-green-500 px-3 py-1 rounded">Login</Link>
        )}
      </div>
    </nav>
  );
}
