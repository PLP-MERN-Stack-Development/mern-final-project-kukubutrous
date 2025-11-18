import React, { createContext, useState, useEffect, useContext } from 'react'
import api from '../utils/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      // fetch profile
      (async () => {
        try {
          const { data } = await api.get('/users/me')
          setUser(data.user)
        } catch (e) {
          console.warn('Auth fetch failed', e)
          setToken(null)
          localStorage.removeItem('token')
        }
      })()
    }
  }, [token])

  const login = async (email, password) => {
    setLoading(true)
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
    setLoading(false)
    return data
  }

  const register = async (payload) => {
    setLoading(true)
    const { data } = await api.post('/auth/register', payload)
    setLoading(false)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)