import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const { token, user } = useAuth()
  const [socket, setSocket] = useState(null)
  const [chats, setChats] = useState([]) // summary list
  const [openWindows, setOpenWindows] = useState([]) // chat window states

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect()
        setSocket(null)
      }
      return
    }

    const s = io((import.meta.env.VITE_API_URL || 'http://localhost:4000').replace('/api', ''), {
      auth: { token }
    })

    s.on('connect', () => console.log('socket connected', s.id))
    s.on('disconnect', () => console.log('socket disconnected'))

    s.on('new_message', (message) => {
      // update chat list / notify windows
      setChats(prev => {
        // naive re-fetch would be better; but append or update summary
        return prev.map(c => (c.id === message.chatId ? { ...c, latestMessage: message } : c))
      })

      // update open windows unread counters
      setOpenWindows(prev => prev.map(w => {
        if (w.chatId === message.chatId && w.minimized) {
          return { ...w, unread: (w.unread || 0) + 1 }
        }
        return w
      }))
    })

    setSocket(s)
    return () => s.disconnect()
  }, [token])

  const openChatWindow = (chatId, userInfo) => {
    setOpenWindows(prev => {
      // if already open, restore
      const existing = prev.find(w => w.chatId === chatId)
      if (existing) return prev.map(w => w.chatId === chatId ? { ...w, minimized: false, unread: 0 } : w)
      return [{ chatId, userInfo, minimized: false, unread: 0 }, ...prev].slice(0, 4) // max 4 windows
    })
  }

  const minimizeWindow = (chatId) => {
    setOpenWindows(prev => prev.map(w => w.chatId === chatId ? { ...w, minimized: true } : w))
  }

  const closeWindow = (chatId) => {
    setOpenWindows(prev => prev.filter(w => w.chatId !== chatId))
  }

  return (
    <ChatContext.Provider value={{ socket, chats, setChats, openWindows, openChatWindow, minimizeWindow, closeWindow }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)