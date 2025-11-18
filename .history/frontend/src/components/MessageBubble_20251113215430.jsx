// frontend/src/components/MessageBubble.jsx
import React from 'react';
import dayjs from 'dayjs';

export default function MessageBubble({ message, isMine }) {
    const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace('/api', '');
    const containerClass = `max-w-xs break-words ${isMine ? 'ml-auto text-right' : 'mr-auto text-left'}`;
    const bubbleClass = `inline-block px-3 py-2 rounded ${isMine ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}`;

    if (!message) return null;

    const { type = 'text', content, text, createdAt } = message;
    const body = content ?? text ?? "";

    const timestamp = createdAt ? dayjs(createdAt).format('HH:mm') : '';

    return (
        <div className={containerClass}>
            {type === 'text' && (
                <div className={bubbleClass}>
                    {body}
                    <div className="text-xs text-gray-400 mt-1">{timestamp}</div>
                </div>
            )}

            {type === 'image' && (
                <div className={bubbleClass}>
                    <img src={API_BASE + body} alt="image" className="max-h-48 rounded" />
                    <div className="text-xs text-gray-400 mt-1">{timestamp}</div>
                </div>
            )}

            {type === 'video' && (
                <div className={bubbleClass}>
                    <video controls className="max-h-48 rounded">
                        <source src={API_BASE + body} />
                        Your browser does not support video playback.
                    </video>
                    <div className="text-xs text-gray-400 mt-1">{timestamp}</div>
                </div>
            )}

            {type === 'audio' && (
                <div className={bubbleClass}>
                    <audio controls>
                        <source src={API_BASE + body} />
                        Your browser does not support audio.
                    </audio>
                    <div className="text-xs text-gray-400 mt-1">{timestamp}</div>
                </div>
            )}

            {(type === 'file' || type === 'pdf') && (
                <div className={bubbleClass}>
                    <a href={API_BASE + body} target="_blank" rel="noreferrer" className="underline">Download file</a>
                    <div className="text-xs text-gray-400 mt-1">{timestamp}</div>
                </div>
            )}
        </div>
    );
}


