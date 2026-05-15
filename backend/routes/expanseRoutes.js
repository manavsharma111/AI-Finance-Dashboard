import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  addExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  downloadExpensesData,
  downloadExpensesDataExcel,
  getExpenseAnalytics,
} from "../controllers/expenseController.js";

const expanseRouter = express.Router();

// Define your expanse routes here, for example:
expanseRouter.post("/add", authMiddleware, addExpense)
expanseRouter.get("/get", authMiddleware, getAllExpenses)
expanseRouter.put("/update/:id", authMiddleware, updateExpense)
expanseRouter.delete("/delete/:id", authMiddleware, deleteExpense)
expanseRouter.get("/csv", authMiddleware, downloadExpensesData)
expanseRouter.get("/excel", authMiddleware, downloadExpensesDataExcel)
expanseRouter.get("/overview", authMiddleware, getExpenseAnalytics)

export default expanseRouter
 
