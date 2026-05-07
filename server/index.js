const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

/* ================= CHAT ================= */
app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    res.json({
      reply: response.data.choices[0].message.content,
    });
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ error: "Chat failed" });
  }
});

/* ================= IMAGE ================= */
app.post("/image", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}`;

    res.json({
      image: imageUrl,
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      error: "Image generation failed",
    });
  }
});