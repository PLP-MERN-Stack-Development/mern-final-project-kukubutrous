import React, { useEffect, useState } from 'react'
import api from '../../api/axios.js'
import { Link } from 'react-router-dom'


export default function Inbox() {
    const [convos, setConvos] = useState([])
    useEffect(() => { (async () => { const res = await api.get('/chats'); setConvos(res.data.convos) })() }, [])
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-xl mb-4">Inbox</h2>
            <div className="space-y-2">
                {convos.map(c => (
                    <div key={c.id} className="p-2 bg-white rounded shadow">
                        <div>Participants: {c.participants.map(p => p.firstName).join(', ')}</div>
                        <Link to={`/conversations/${c.id}`} className="text-indigo-600">Open</Link>
                    </div>
                ))}
            </div>
        </div>
    )
}