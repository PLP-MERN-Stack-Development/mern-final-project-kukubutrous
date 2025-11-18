import { useState, useRef } from "react";

function ChatWindow({ chatId, userName, messages, sendMessage, closeChat, positionIndex }) {
  const [text, setText] = useState("");
  const [pos, setPos] = useState({ x: window.innerWidth - 300 - positionIndex * 20, y: window.innerHeight - 400 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef(null);

  const handleMouseDown = (e) => {
    setDragging(true);
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPos({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(chatId, text.trim());
      setText("");
    }
  };

  return (
    <div
      ref={windowRef}
      className="fixed w-80 h-96 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow flex flex-col z-50 cursor-default"
      style={{ left: pos.x, top: pos.y }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Header / draggable handle */}
      <div
        className="flex justify-between items-center p-2 bg-green-500 text-white font-bold rounded-t cursor-move"
        onMouseDown={handleMouseDown}
      >
        <span>{userName}</span>
        <button onClick={() => closeChat(chatId)} className="font-bold">×</button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-2 overflow-y-auto space-y-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-1 rounded max-w-[75%] ${
              m.senderId === localStorage.getItem("userId")
                ? "bg-green-100 dark:bg-green-700 self-end"
                : "bg-gray-200 dark:bg-gray-700 self-start"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-2 flex gap-2 border-t border-gray-300 dark:border-gray-700">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type..."
          className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="bg-green-500 hover:bg-green-600 text-white px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
