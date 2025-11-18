import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getProfile } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const profile = await getProfile(token);
          setUser(profile);
        } catch (err) {
          setUser(null);
          setToken("");
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  const register = async (form) => {
    return await registerUser(form);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
