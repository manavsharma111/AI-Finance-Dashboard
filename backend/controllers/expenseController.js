import expenseModel from "../models/expenseModel.js"
import getDateRange from "../utlis/dataFilter.js"
import XLSX from "xlsx"

// add expense
export const addExpense = async (req, res) => {
        const userId= req.user._id
    const { description, amount, category, date } = req.body   
    
    try{
        if(!description || !amount || !category || !date){
            return res.status(400).json({
                success:false,  
                message:"All fields are required"
            })
        }
        const newExpense = new expenseModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date)
            
        })
        await newExpense.save()
        res.status(201).json({
            success:true,
            message:"Expense added successfully",
            expense: newExpense
        })
    } 
    catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

// to get all expenses of a user
export const getAllExpenses = async (req, res) => {
    const userId = req.user._id
    try {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 })
        res.json(expenses)
    }
    catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

// update expense
export const updateExpense = async (req, res) => {
   const {id} = req.params
    const userId = req.user._id
    const { description, amount } = req.body
    try {
        const updatedExpense = await expenseModel.findOneAndUpdate(
            { _id: id, userId },
            { description, amount },
            { new: true }
        )
        if (!updatedExpense) {
            return res.status(404).json({   
                success: false,
                message: "Expense not found"
            })
        }
        res.json({
            success: true,
            message: "Expense updated successfully",
            expense: updatedExpense
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

// delete expense
export const deleteExpense = async (req, res) => {
    const { id } = req.params
    const userId = req.user._id
    try {
        const deletedExpense = await expenseModel.findOneAndDelete({ _id: id, userId })
        if (!deletedExpense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            })
        }
        res.json({
            success: true,
            message: "Expense deleted successfully",
            expense: deletedExpense
        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

// download expenses excel sheet
export const downloadExpensesDataExcel = async (req, res) => {
    const userId = req.user._id
    try {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 })
        const plainData = expenses.map(expense => ({
            Description: expense.description,
            Amount: expense.amount,
            Category: expense.category,
            Date: new Date(expense.date).toLocaleDateString() 
        }))
        const worksheet = XLSX.utils.json_to_sheet(plainData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "expenseModel")
        XLSX.writeFile(workbook, "expense_details.xlsx")
        res.download("expense_details.xlsx")
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// download expenses data as csv
export const downloadExpensesData = async (req, res) => {
    const userId = req.user._id
    try {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 })
        const csvData = "Description,Amount,Category,Date\n" + 
            expenses.map(expense => `${expense.description},${expense.amount},${expense.category},${expense.date.toISOString()}`).join("\n")  
        res.setHeader("Content-Type", "text/csv")
        res.setHeader("Content-Disposition", "attachment; filename=expenses_data.csv")
        res.send(csvData)
    } catch (error) {
        res.status(400).json({
            success:false,  
            message:error.message
        })
    }
}

// to get expense data for analytics
export const getExpenseAnalytics = async (req, res) => {
    try{
        const userId = req.user._id
        const {range="monthly"} = req.query
        const {start, end} = getDateRange(range)

        const expenses = await expenseModel.find({
            userId,
            date: {
                $gte: start,
                $lte: end
            },
        }).sort({ date: -1 })
           
        const totalExpense = expenses.reduce((acc, cur) => acc + cur.amount, 0);
        const averageExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;
        const numberOfTransactions = expenses.length;
        const recentTransactions = expenses.slice(0, 9);
        res.json({
            success:true,
            totalExpense,
            averageExpense,
            numberOfTransactions,
            recentTransactions,
            range
        })
    }
    catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }   
}
