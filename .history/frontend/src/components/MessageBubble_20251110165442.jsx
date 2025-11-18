import React from 'react';

export default function MessageBubble({ message, isMine }) {
    const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace('/api', '');
    if (!message) return null;

    const containerClass = `max-w-xs break-words ${isMine ? 'ml-auto text-right' : 'mr-auto text-left'}`;
    const bubbleClass = `inline-block px-3 py-2 rounded ${isMine ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800'}`;
    const { type = 'text', content } = message;

    if (type === 'text') return <div className={containerClass}><div className={bubbleClass}>{content}</div></div>;
    if (type === 'image') return <div className={containerClass}><img src={API_BASE + content} className="max-h-48 rounded" /></div>;
    if (type === 'video') return <div className={containerClass}><video controls className="max-h-48 rounded"><source src={API_BASE + content} /></video></div>;
    if (type === 'audio') return <div className={containerClass}><audio controls><source src={API_BASE + content} /></audio></div>;
    if (type === 'file' || type === 'pdf') return <div className={containerClass}><a href={API_BASE + content} target="_blank" rel="noreferrer" className="underline">Download file</a></div>;

    return null;
}
