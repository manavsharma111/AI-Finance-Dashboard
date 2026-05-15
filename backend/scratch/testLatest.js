import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const test = async () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    // Try to list models or just try a different one
    // In newer versions of the SDK, gemini-1.5-flash is correct.
    // Let's try gemini-1.5-flash-latest
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Test");
    console.log("Success with gemini-1.5-flash");
  } catch (e) {
    console.log("Error with gemini-1.5-flash:", e.message);
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        await model.generateContent("Test");
        console.log("Success with gemini-1.5-flash-latest");
    } catch (e2) {
        console.log("Error with gemini-1.5-flash-latest:", e2.message);
    }
  }
};

test();
