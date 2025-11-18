import { useState, useRef } from "react";

function ChatWindow({ chatId, userName, messages, sendMessage, closeChat, positionIndex }) {
  const [text, setText] = useState("");
  const [pos, setPos] = useState({
    x: window.innerWidth - 300 - positionIndex * 30,
    y: window.innerHeight - 400 - positionIndex * 10,
  });
  const [dragging, setDragging] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef(null);

  // --- Drag handlers ---
  const handleMouseDown = (e) => {
    setDragging(true);
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    let newX = e.clientX - dragOffset.current.x;
    let newY = e.clientY - dragOffset.current.y;

    // --- Snap-to-edge threshold ---
    const snapThreshold = 20;
    if (newX < snapThreshold) newX = 0;
    if (newY < snapThreshold) newY = 0;
    if (newX + 300 > window.innerWidth - snapThreshold) newX = window.innerWidth - 300;
    if (newY + (minimized ? 40 : 400) > window.innerHeight - snapThreshold) newY = window.innerHeight - (minimized ? 40 : 400);

    setPos({ x: newX, y: newY });
  };

  const handleMouseUp = () => setDragging(false);

  // --- Send message ---
  const handleSend = () => {
    if (text.trim()) {
      sendMessage(chatId, text.trim());
      setText("");
    }
  };

  return (
    <div
      ref={windowRef}
      className={`fixed w-80 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow flex flex-col z-50 cursor-default`}
      style={{ left: pos.x, top: pos.y, height: minimized ? 40 : 400 }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center p-2 bg-green-500 text-white font-bold rounded-t cursor-move"
        onMouseDown={handleMouseDown}
      >
        <span>{userName}</span>
        <div className="flex gap-2">
          <button onClick={() => setMinimized(!minimized)} className="font-bold">_</button>
          <button onClick={() => closeChat(chatId)} className="font-bold">×</button>
        </div>
      </div>

      {/* Messages */}
      {!minimized && (
        <>
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
        </>
      )}
    </div>
  );
}

export default ChatWindow;
