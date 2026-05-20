require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

app.post("/api/check-ingredient", async (req, res) => {
  try {
    const { ingredient } = req.body;

    const prompt = `
You are a startup market intelligence AI for India.

Analyze this product trend: "${ingredient}"

Return ONLY valid JSON.

{
  "name": "",
  "score": 0,
  "growth": "",
  "marketSize": "",
  "readiness": "",
  "competition": "",
  "timeWindow": "",
  "whyTrending": "",
  "targetAudience": "",
  "opportunity": ""
}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.choices[0].message.content;

    const result = JSON.parse(text);

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});