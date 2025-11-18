import React, { useEffect, useState } from 'react';
import { useChat } from '../context/ChatContext';
import api from '../utils/api';

export default function ChatWindow({ conversationId, otherUserId }){
  const { messages, sendMessage, sendTyping, emitMessageRead, typing } = useChat();
  const [text, setText] = useState('');
  const [localMessages, setLocalMessages] = useState([]);

  useEffect(()=> {
    // load messages for conversation from backend if you have endpoint (not in rewritten controllers),
    // otherwise we rely on socket new_message events. Assume messages already streamed.
    setLocalMessages(messages.filter(m => m.conversationId === conversationId));
  }, [messages, conversationId]);

  useEffect(()=> {
    // mark unread as read - emit read receipt for each message that isn't read and is for this convo
    localMessages.forEach(m => {
      if (!m.read && m.senderId !== otherUserId) {
        emitMessageRead(conversationId, m.id);
      }
    })
  }, [localMessages]);

  const onSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await sendMessage(conversationId, text);
    setText('');
  };

  const onType = () => {
    sendTyping(conversationId);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-3">
        {localMessages.map(m => (
          <div key={m.id} className={`my-1 ${m.senderId === otherUserId ? 'text-left' : 'text-right'}`}>
            <div className="inline-block bg-gray-100 px-3 py-2 rounded">{m.text}</div>
            {m.read && <span className="text-xs text-gray-400 ml-1">✔✔</span>}
          </div>
        ))}
        {typing && typing.conversationId === conversationId && <div className="italic text-sm text-gray-500">User is typing...</div>}
      </div>

      <form onSubmit={onSend} className="flex border-t p-2">
        <input className="flex-1 border rounded px-3 py-2"
               value={text}
               onChange={(e)=> setText(e.target.value)}
               onKeyDown={onType}
               placeholder="Type a message..." />
        <button className="ml-2 bg-blue-600 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  )
}
