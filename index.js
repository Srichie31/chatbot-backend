import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  console.log(message);
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: {
        role: "user",
        parts: [{ text: message}],
      },
    });

    const generatedText = response.candidates[0].content.parts
      .map((part) => part.text)
      .join("");
    console.log("Gemini says:", generatedText);
    const text = generatedText;
    console.log(generatedText);

    res.json({ reply: text });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ reply: "Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
