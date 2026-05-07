import { useState } from "react";
const API = "https://ladogpt-backend.onrender.com";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState("");
  const recognition = new window.SpeechRecognition();
recognition.lang = "en-US";

const startVoice = () => {
  recognition.start();

  recognition.onresult = (event) => {
    setInput(event.results[0][0].transcript);
  };
};

const speak = (text) => {
  const speech = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(speech);
};
  // ================= CHAT =================
  const sendMessage = async () => {
  const res = await fetch(`${API}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: input }),
  });

  const data = await res.json();

  if (!data.reply) return;

  setMessages((prev) => [
    ...prev,
    { role: "ai", text: data.reply },
  ]);

  setInput("");
};

  // ================= IMAGE GENERATION =================
  const generateImage = async () => {
  const res = await fetch(`${API}/image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: input }),
  });

  const data = await res.json();

  if (!data.image) return;

  setMessages((prev) => [
    ...prev,
    { role: "ai", image: data.image },
  ]);

  setInput("");
};
  // ================= UI =================
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">

      {/* CHAT AREA */}
      <div className="flex-1 p-4 overflow-y-auto">

{messages.map((msg, i) => (
  <div key={i} className="mb-2 flex">

    <div
      className={`p-2 rounded-lg inline-block max-w-xs ${
        msg.role === "user"
          ? "bg-blue-600 ml-auto text-white"
          : "bg-gray-700 text-white"
      }`}
    >
{msg.text && <div className="whitespace-pre-wrap">{msg.text}</div>}

{msg.image && (
  <img
    src={msg.image}
    alt="AI"
    style={{ width: "200px", borderRadius: "10px", marginTop: "10px" }}
  />
)}
  </div>
  </div>
))}

      {/* TEXT */}
      <div>{msg.text}</div>

      {/* IMAGE (NEW ADDITION) */}
      {msg.image && (
        <img
          src={msg.image}
          alt="AI"
          className="mt-2 rounded-lg max-w-full"
        />
      )}

    </div>
  </div>
))}

        {/* IMAGE DISPLAY */}
        {image && (
          <div className="mt-4">
            <img
              src={image}
              alt="AI Generated"
              className="rounded-xl max-w-full"
            />
          </div>
        )}

      </div>

      {/* INPUT AREA */}
      <div className="p-3 flex">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded-l-lg bg-gray-800 outline-none"
          placeholder="Ask or generate image..."
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 px-6"
        >
          Send
        </button>

        <button
          onClick={generateImage}
          className="bg-green-600 px-6 rounded-r-lg"
        >
          Image
        </button>

      </div>

    </div>
  );
}

export default App;
   