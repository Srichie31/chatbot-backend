import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  console.log(message);
  try {
    const response = await openai.chat.completions.create({
      model: "gemini-2.5-flash-preview-04-17",
      reasoning_effort: "low",
      messages: [
          { role: "system", content: "You are SrichieAI, an expert AI assistant built to provide clear, concise, and accurate answers. Always prioritize factual correctness and relevance. If a question is unclear or incomplete, ask for clarification before responding. Do not guess or speculate. When helpful, use bullet points or short paragraphs. Stay professional, avoid unnecessary elaboration, and always speak in a helpful, polite tone." },
          {
              role: "user",
              content: message,
          },
      ],
  });
  // console.log(response.choices[0].message);
    // const response = await genAI.models.generateContent({
    //   model: "gemini-2.0-flash",
    //   contents: {
    //     role: "user",
    //     parts: [{ text: message }],
    //   },
    // });

    // const generatedText = response.candidates[0].content.parts
    //   .map((part) => part.text)
    //   .join("");
    // console.log("Gemini says:", generatedText);
    const text = response.choices[0].message.content;
    res.json({ reply: text });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ reply: "Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
