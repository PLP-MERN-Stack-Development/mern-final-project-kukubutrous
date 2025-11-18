import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import ChatWindow from '../components/ChatWindow';

export default function Conversation() {
    const { id } = useParams(); // conversation id
    const [convo, setConvo] = useState(null);
    const [otherUserId, setOtherUserId] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get('/chats'); // list convos
                const conv = res.data.convos?.find(c => String(c.id) === String(id)) || res.data.find(c => String(c.id) === String(id));
                setConvo(conv);
                if (conv) {
                    // find other participant id
                    const me = (await api.get('/users/profile')).data;
                    const other = conv.participants.find(p => p.id !== me.id);
                    setOtherUserId(other?.id);
                }
            } catch (err) { /* ignore */ }
        })();
    }, [id]);

    if (!convo) return <div>Loading...</div>;
    return <ChatWindow conversationId={convo.id} otherUserId={otherUserId} />
}
