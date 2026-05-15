import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const testGemini = async () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing in .env file");
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    console.log("Testing Gemini API connection with gemini-2.0-flash...");
    const result = await model.generateContent("Hello");
    const response = await result.response;
    console.log("✅ Gemini Response:", response.text());
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
  }
};

testGemini();
