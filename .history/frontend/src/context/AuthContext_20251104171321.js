import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'
import { connectSocket, disconnectSocket } from '../utils/socket'


const AuthContext = createContext()
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [ready, setReady] = useState(false)


    useEffect(() => {
        async function init() {
            const token = localStorage.getItem('token')
            if (!token) { setReady(true); return }
            try {
                const res = await api.get('/users/me')
                setUser(res.data.user)
                connectSocket()
            } catch (err) {
                localStorage.removeItem('token')
            } finally { setReady(true) }
        }
        init()
        return () => { disconnectSocket() }
    }, [])


    const login = (token, userData) => {
        localStorage.setItem('token', token)
        setUser(userData)
        connectSocket()
    }
    const logout = () => { localStorage.removeItem('token'); setUser(null); disconnectSocket(); window.location.href = '/login' }


    return <AuthContext.Provider value={{ user, setUser, login, logout, ready }}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)