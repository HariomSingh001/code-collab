import { useEffect, useRef, useState } from "react";
import { Send, Wifi, WifiOff } from "lucide-react";

function ChatPanel({ messages, onSendMessage, isConnected }) {
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Connection status */}
      <div className="flex items-center gap-2 px-4 py-2 bg-base-100 border-b border-base-content/10">
        {isConnected ? (
          <>
            <Wifi className="size-3.5 text-success" />
            <span className="text-xs text-success font-medium">Connected</span>
          </>
        ) : (
          <>
            <WifiOff className="size-3.5 text-base-content/40" />
            <span className="text-xs text-base-content/40">Connecting...</span>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${
              msg.sender === "system"
                ? "text-center"
                : msg.isOwn
                ? "flex justify-end"
                : "flex justify-start"
            }`}
          >
            {msg.sender === "system" ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-base-content/5 text-xs text-base-content/50">
                <div className="size-1.5 rounded-full bg-primary" />
                {msg.text}
              </div>
            ) : (
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  msg.isOwn
                    ? "bg-primary text-primary-content rounded-br-sm"
                    : "bg-base-100 border border-base-content/10 rounded-bl-sm"
                }`}
              >
                {!msg.isOwn && (
                  <p className="text-xs font-semibold mb-0.5 opacity-70">
                    {msg.sender}
                  </p>
                )}
                <p className="text-sm">{msg.text}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    msg.isOwn ? "text-primary-content/50" : "text-base-content/40"
                  }`}
                >
                  {new Date(msg.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-3 bg-base-100 border-t border-base-content/10"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="input input-sm input-bordered flex-1"
        />
        <button
          type="submit"
          className="btn btn-primary btn-sm btn-circle"
          disabled={!input.trim()}
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}

export default ChatPanel;
