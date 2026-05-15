import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getFinancialInsights } from "../controllers/aiController.js";

const aiRouter = express.Router();

// aiRouter.post("/categorize", authMiddleware, categorizeExpense);
aiRouter.get("/insights", authMiddleware, getFinancialInsights);

export default aiRouter;
