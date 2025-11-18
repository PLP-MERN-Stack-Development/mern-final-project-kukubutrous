import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      if (!token) { setReady(true); return; }
      try {
        // we fetch profile to ensure token valid & get full user
        const res = await api.get('/users/profile');
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem('token');
      } finally {
        setReady(true);
      }
    })();
  }, []);

  async function login(email, password){
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    // fetch profile
    const profile = await api.get('/users/profile');
    setUser(profile.data);
    return profile.data;
  }

  async function register(payload){
    await api.post('/auth/register', payload);
  }

  function logout(){
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  }

  return <AuthContext.Provider value={{ user, setUser, login, register, logout, ready }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);
