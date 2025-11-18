import { io } from 'socket.io-client'


let socket = null
export function connectSocket() {
const token = localStorage.getItem('token')
if (!token) return null
socket = io(import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:4000', {
auth: { token }
})
return socket
}
export function getSocket() { return socket }
export function disconnectSocket() { if (socket) socket.disconnect(); socket = null }