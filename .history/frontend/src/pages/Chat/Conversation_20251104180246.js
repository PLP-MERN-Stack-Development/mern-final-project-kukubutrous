import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../api/axios.js'
import { getSocket } from '../../utils/socket.js'


export default function Conversation() {
    const { id } = useParams()
    const [messages, setMessages] = useState([])
    const [text, setText] = useState('')


    useEffect(() => { (async () => { const res = await api.get(`/chats`); const convo = res.data.convos.find(c => c.id == id); setMessages(convo?.Messages || []) })() }, [id])


    useEffect(() => {
        const s = getSocket();
        if (!s) return;
        s.on('message_new', msg => { if (msg.conversationId == id) setMessages(prev => [...prev, msg]) })
        return () => s.off('message_new')
    }, [id])


    const send = async e => { e.preventDefault(); await api.post(`/chats/${id}/messages`, { text }); setText('') }


    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-xl mb-4">Conversation</h2>
            <div className="space-y-2 mb-4">
                {messages.map(m => <div key={m.id} className="p-2 bg-white rounded">{m.text}</div>)}
            </div>
            <form onSubmit={send} className="flex gap-2">
                <input value={text} onChange={e => setText(e.target.value)} className="flex-1 p-2 border" />
                <button className="bg-indigo-600 text-white p-2">Send</button>
            </form>
        </div>
    )
}