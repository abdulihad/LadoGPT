const express = require("express");
const cors = require("cors");
const axios = require("axios");
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
speak(data.reply);
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // 1. AI TEXT (Groq)
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    const aiText = response.data.choices[0].message.content;

    // 2. IMAGE (optional trigger)
    let imageUrl = null;

    if (
      userMessage.toLowerCase().includes("image") ||
      userMessage.toLowerCase().includes("generate")
    ) {
      const prompt = encodeURIComponent(userMessage);

      imageUrl = `https://image.pollinations.ai/prompt/${prompt}`;
    }

    // 3. SEND RESPONSE
    res.json({
      reply: aiText,
      image: imageUrl,
    });

  } catch (error) {
    console.log(error);

    res.json({
      reply: "AI Error",
      image: null,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
app.post("/image", async (req, res) => {
  try {
    const prompt = encodeURIComponent(req.body.prompt);

    const imageUrl = `https://image.pollinations.ai/prompt/${prompt}`;

    res.json({
      image: imageUrl,
    });

  } catch (error) {
    console.log(error);

    res.json({
      error: "Image generation failed",
    });
  }
});