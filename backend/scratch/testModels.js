import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const listModels = async () => {
  const apiKey = process.env.GEMINI_API_KEY;
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // There is no direct listModels in the SDK usually, but let's try a simpler model name
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Hello");
    const response = await result.response;
    console.log("✅ gemini-pro works:", response.text());
  } catch (error) {
    console.error("❌ gemini-pro failed:", error.message);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent("Hello");
      const response = await result.response;
      console.log("✅ gemini-1.5-pro works:", response.text());
    } catch (e2) {
       console.error("❌ gemini-1.5-pro failed:", e2.message);
    }
  }
};

listModels();
