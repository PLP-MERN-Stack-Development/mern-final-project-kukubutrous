//frontend/src/com


import React from 'react';

export default function MessageBubble({ message, isMine }) {
    const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace('/api', '');
    const containerClass = `max-w-xs break-words ${isMine ? 'ml-auto text-right' : 'mr-auto text-left'}`;
    const bubbleClass = `inline-block px-3 py-2 rounded ${isMine ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}`;

    if (!message) return null;
    const { type = 'text', content, text } = message;

    // backend sometimes returns 'content' or 'text' — prefer 'content'
    const body = content ?? text ?? "";

    return (
        <div className={containerClass}>
            {type === 'text' && <div className={bubbleClass}>{body}</div>}

            {type === 'image' && (
                <div className={bubbleClass}>
                    <img src={API_BASE + body} alt="image" className="max-h-48 rounded" />
                </div>
            )}

            {type === 'video' && (
                <div className={bubbleClass}>
                    <video controls className="max-h-48 rounded">
                        <source src={API_BASE + body} />
                        Your browser does not support video playback.
                    </video>
                </div>
            )}

            {type === 'audio' && (
                <div className={bubbleClass}>
                    <audio controls>
                        <source src={API_BASE + body} />
                        Your browser does not support audio.
                    </audio>
                </div>
            )}

            {(type === 'file' || type === 'pdf') && (
                <div className={bubbleClass}>
                    <a href={API_BASE + body} target="_blank" rel="noreferrer" className="underline">Download file</a>
                </div>
            )}
        </div>
    );
}
