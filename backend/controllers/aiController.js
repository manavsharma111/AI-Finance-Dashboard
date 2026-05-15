import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import expenseModel from "../models/expenseModel.js";
import incomeModel from "../models/incomeModel.js";
import dotenv from "dotenv";
import userModel from "../models/userModel.js";

dotenv.config();

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

//Financial Insights & Budgeting Advice
export const getFinancialInsights = async (req, res) => {
  if (!genAI && !groq) {
    return res.status(500).json({ success: false, message: "AI API Keys are missing." });
  }
  const userId = req.user._id;
  const { forceRefresh } = req.query;

  try {
    // Check Cache first
    const user = await userModel.findById(userId);

    const oneHour = 60 * 60 * 1000;
    const isCacheValid = user.lastInsightsDate && (Date.now() - new Date(user.lastInsightsDate).getTime() < oneHour);

    if (isCacheValid && !forceRefresh && user.aiInsights) {
      return res.status(200).json({
        success: true,
        insights: user.aiInsights,
        cached: true
      });
    }

    // If no cache or expired, fetch data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [expenses, incomes] = await Promise.all([
      expenseModel.find({ userId, date: { $gte: thirtyDaysAgo } }),
      incomeModel.find({ userId, date: { $gte: thirtyDaysAgo } })
    ]);

    if (expenses.length === 0 && incomes.length === 0) {
      return res.status(200).json({
        success: true,
        insights: "No recent transactions found. Start adding your expenses and income to get personalized financial insights!"
      });
    }

    // Prepare data summary
    const expenseSummary = expenses.map(e => ({
      description: e.description,
      amount: e.amount,
      category: e.category,
      date: e.date.toISOString().split("T")[0]
    }));

    const incomeSummary = incomes.map(i => ({
      description: i.description,
      amount: i.amount,
      category: i.category,
      date: i.date.toISOString().split("T")[0]
    }));

    const promptText = `
      You are an expert financial advisor named 'Expense Tracker AI'. 
      Analyze the following 30-day data and provide 4 very short, powerful, and actionable insights in English.
      
      Recent Expenses: ${JSON.stringify(expenseSummary)}
      Recent Income: ${JSON.stringify(incomeSummary)}
      
      Structure your response:
      - Use bullet points.
      - Each point should be in English.
      - Example: "Your spending in Food category is very high, try to control it."
      - Keep it professional yet friendly.
      - Return ONLY the bullet points.
    `;

    let insights = "";

    // Prefer Groq for speed and reliability
    if (groq) {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: promptText }],
        model: "llama-3.3-70b-versatile",
      });
      insights = completion.choices[0]?.message?.content || "";
    } else {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(promptText);
      const response = await result.response;
      insights = response.text().trim();
    }

    // Update Cache
    user.aiInsights = insights;
    user.lastInsightsDate = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      insights
    });
  } catch (error) {
    console.error("AI Insights Error:", error);
    
    let message = "Failed to generate financial insights";
    if (error.status === 429 || error.code === "rate_limit_exceeded") {
      message = "AI is currently busy. Please try again in 1 minute.";
    }

    res.status(error.status || 500).json({
      success: false,
      message
    });
  }
};
