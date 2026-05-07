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

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
        },
        responseType: "arraybuffer",
      }
    );

    const base64 = Buffer.from(response.data).toString("base64");

    res.json({
      image: `data:image/png;base64,${base64}`,
    });
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ error: "Image failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});