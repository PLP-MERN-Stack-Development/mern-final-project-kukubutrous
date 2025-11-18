import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../utils/apiClient";

// --- Create context
const AuthContext = createContext();

// --- Hook for easy access
export const useAuth = () => useContext(AuthContext);

// --- Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // Update localStorage whenever user or token changes
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");

    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");

    // Update apiClient default headers
    apiClient.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
  }, [user, token]);

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
