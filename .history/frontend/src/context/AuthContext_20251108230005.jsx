import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api.get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => logout());
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setToken(res.data.token);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };

  const register = async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

*/