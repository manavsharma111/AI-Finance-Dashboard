import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  addIncome,
  getAllIncome,
  updateIncome,
  deleteIncome,
  downloadIncomeData,
  downloadIncomeDataExcel,
  getIncomeOverview,
} from "../controllers/incomeController.js";
const incomeRouter = express.Router();

incomeRouter.post("/add", authMiddleware, addIncome)
incomeRouter.get("/get", authMiddleware, getAllIncome)
incomeRouter.put("/update/:id", authMiddleware, updateIncome)
incomeRouter.delete("/delete/:id", authMiddleware, deleteIncome)
incomeRouter.get("/csv", authMiddleware, downloadIncomeData)
incomeRouter.get("/excel", authMiddleware, downloadIncomeDataExcel)
incomeRouter.get("/overview", authMiddleware, getIncomeOverview)

export default incomeRouter


