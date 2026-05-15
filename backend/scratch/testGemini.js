import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const testGemini = async () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing in .env file");
    return;
  }

  console.log("Using API Key:", apiKey.substring(0, 10) + "...");

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    console.log("Testing Gemini API connection...");
    const result = await model.generateContent("Hello, are you working? Respond with 'Yes' if you are.");
    const response = await result.response;
    console.log("✅ Gemini Response:", response.text());
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
    if (error.message.includes("API_KEY_INVALID")) {
      console.error("The API key you provided is invalid.");
    } else if (error.message.includes("403")) {
      console.error("Access denied. Check your API key permissions or billing.");
    }
  }
};

testGemini();
