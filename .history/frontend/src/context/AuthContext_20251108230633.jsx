// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data.user);
        } catch (err) {
          console.error("Auth fetch error:", err);
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const register = async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, register, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

*