import { useEffect, useRef, useState } from "react";
const API = "https://lado-gpt-api.onrender.com";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ================= CHAT =================
  const sendMessage = async () => {
    if (!input.trim()) return;

    const text = input;

    const userMessage = {
      type: "text",
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = await response.json();

      const aiMessage = {
        type: "text",
        role: "ai",
        text: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  // ================= IMAGE =================
  const generateImage = async () => {
    if (!input.trim()) return;

    const text = input;

    const userMessage = {
      type: "text",
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: text,
        }),
      });

      const data = await response.json();

      const imageMessage = {
        type: "image",
        role: "ai",
        image: data.image,
      };

      setMessages((prev) => [...prev, imageMessage]);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  // ================= ENTER KEY =================
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // ================= UI =================
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">

      {/* HEADER */}
      <div className="p-4 border-b border-gray-700 text-xl font-bold">
        AI Assistant
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {msg.type === "text" ? (
              <div
                className={`max-w-[75%] p-3 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-blue-600"
                    : "bg-gray-700"
                }`}
              >
                {msg.text}
              </div>
            ) : (
              <img
                src={msg.image}
                alt="Generated"
                className="rounded-2xl max-w-sm"
              />
            )}
          </div>
        ))}

        {loading && (
          <div className="text-gray-400">
            AI is thinking...
          </div>
        )}

        <div ref={bottomRef}></div>

      </div>

      {/* INPUT AREA */}
      <div className="p-4 border-t border-gray-700 flex gap-2">

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="flex-1 p-3 rounded-xl bg-gray-800 outline-none"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 px-5 rounded-xl"
        >
          Send
        </button>

        <button
          onClick={generateImage}
          disabled={loading}
          className="bg-green-600 px-5 rounded-xl"
        >
          Image
        </button>

      </div>

    </div>
  );
}

export default App;   