import React from 'react';

export default function MessageBubble({ message, isMine }) {
  const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace('/api', '');

  const containerClass = `max-w-xs break-words ${isMine ? 'ml-auto text-right' : 'mr-auto text-left'}`;
  const bubbleClass = `inline-block px-3 py-2 rounded ${isMine ? 'bg-brandGreen text-white' : 'bg-gray-100 text-gray-800'}`;

  if (!message) return null;

  const { type = 'text', content } = message;

  return (
    <div className={containerClass}>
      {type === 'text' && <div className={bubbleClass}>{content}</div>}

      {type === 'image' && (
        <div className={bubbleClass}>
          <img src={API_BASE + content} alt="image" className="max-h-48 rounded" />
        </div>
      )}

      {type === 'video' && (
        <div className={bubbleClass}>
          <video controls className="max-h-48 rounded">
            <source src={API_BASE + content} />
            Your browser does not support video playback.
          </video>
        </div>
      )}

      {type === 'audio' && (
        <div className={bubbleClass}>
          <audio controls>
            <source src={API_BASE + content} />
            Your browser does not support audio.
          </audio>
        </div>
      )}

      {(type === 'file' || type === 'pdf') && (
        <div className={bubbleClass}>
          <a href={API_BASE + content} target="_blank" rel="noreferrer" className="underline">
            Download file
          </a>
        </div>
      )}
    </div>
  );
}
