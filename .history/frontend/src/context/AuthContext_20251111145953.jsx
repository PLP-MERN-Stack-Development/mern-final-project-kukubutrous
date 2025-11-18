// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load token from localStorage and verify user session
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
        try {
          // Call backend to verify token and fetch user info
          const res = await api.get("/auth/me");
          setUser(res.data);
          setToken(savedToken);
        } catch (err) {
          console.warn("Session expired or invalid token, logging out.");
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // ✅ Login
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token: tkn, user: usr } = res.data;

      if (!usr?.verified) {
        return { success: false, message: "Please verify your email first." };
      }

      setToken(tkn);
      setUser(usr);

      localStorage.setItem("token", tkn);
      localStorage.setItem("user", JSON.stringify(usr));

      api.defaults.headers.common["Authorization"] = `Bearer ${tkn}`;
      return { success: true, user: usr };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  };

  // ✅ Refresh user info (useful after profile update or role change)
  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        setUser,
        refreshUser,
        isAdmin: user?.role === "admin",
        isSuperAdmin: user?.role === "superAdmin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuth = () => useContext(AuthContext);







/*
//frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load token and user from localStorage on app start
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }
    setLoading(false);
  }, []);

  // ✅ Login function
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token: tkn, user: usr } = res.data;

      if (!usr.verified) {
        return {
          success: false,
          message: "Please verify your email before logging in.",
        };
      }

      setToken(tkn);
      setUser(usr);

      localStorage.setItem("token", tkn);
      localStorage.setItem("user", JSON.stringify(usr));

      api.defaults.headers.common["Authorization"] = `Bearer ${tkn}`;
      return { success: true, user: usr, token: tkn };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // ✅ Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for easy use
export const useAuth = () => useContext(AuthContext);


*/