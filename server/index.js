const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

/* ================= CHAT ================= */
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content ||
      "No response from AI";

    res.json({ reply });
  } catch (err) {
    console.log("CHAT ERROR:", err.response?.data || err.message);

    res.status(500).json({
      error: err.response?.data || err.message,
    });
  }
});

/* ================= IMAGE ================= */
app.post("/image", (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}`;

    res.json({ image: imageUrl });
  } catch (err) {
    res.status(500).json({
      error: "Image generation failed",
    });
  }
});

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.send("AI Backend Running...");
});

/* ================= SERVER ================= */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});