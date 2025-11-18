




/*
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

export default function Inbox() {
    const [convos, setConvos] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get('/chats'); // if your backend had a GET convos endpoint; if not, adapt
                setConvos(res.data.convos || res.data);
            } catch (err) { /* ignore */ }
        })();
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-xl mb-3">Inbox</h2>
            <div className="space-y-2">
                {convos.map(c => (
                    <div key={c.id} className="p-3 bg-white rounded shadow">
                        <div>Participants: {c.participants.map(p => p.firstName).join(', ')}</div>
                        <Link to={`/conversations/${c.id}`} className="text-blue-500">Open</Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
*/