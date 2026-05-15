import incomeModel from "../models/incomeModel.js"
import XLSX from "xlsx"
import getDateRange from "../utlis/dataFilter.js"

// add income
export const addIncome = async (req, res) => {
    const userId= req.user._id
    const { description, amount, category, date } = req.body   
    
    try{
        if(!description || !amount || !category || !date){
            return res.status(400).json({
                success:false,  
                message:"All fields are required"
            })
        }
        const newIncome = new incomeModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date)
            
        })
        await newIncome.save()
        res.status(201).json({
            success:true,
            message:"Income added successfully",
            income: newIncome
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

// to get all income of a user
export const getAllIncome = async (req, res) => {
    const userId = req.user._id 
    try {
        const incomes = await incomeModel.find({ userId }).sort({ date: -1 })
        res.json(incomes)
    }
    catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

// update income
export const updateIncome = async (req, res) => {
   const {id} = req.params
   const userId = req.user._id
   const { description, amount } = req.body
   try {
    const updatedIncome = await incomeModel.findOneAndUpdate(
        { _id: id, userId },
        { description, amount },
        { new: true }
    )
    if (!updatedIncome) {
        return res.status(404).json({
            success:false,
            message:"Income not found"
        })
    }
    res.json({
        success:true,
        message:"Income updated successfully",
        date: updatedIncome.date,
        income: updatedIncome
    })
   } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
   }
}

// delete income
export const deleteIncome = async (req, res) => {
    const {id} = req.params.id
    const userId = req.user._id
    try {
        const deletedIncome = await incomeModel.findByIdAndDelete({ _id: id})   
        if (!deletedIncome) {   
            return res.status(404).json({
                success:false,
                message:"Income not found"
            })
        }
        res.json({
            success:true,
            message:"Income deleted successfully",
            income: deletedIncome
        })
    } catch (error) {
        res.status(400).json({
            success:false,  
            message:error.message
        })
    }   
}

// to download income data as csv
export const downloadIncomeData = async (req, res) => {
    const userId = req.user._id
    try {
        const incomes = await incomeModel.find({ userId }).sort({ date: -1 })
        const csvData = "Description,Amount,Category,Date\n" + 
            incomes.map(income => `${income.description},${income.amount},${income.category},${income.date.toISOString()}`).join("\n")  
        res.setHeader("Content-Type", "text/csv")
        res.setHeader("Content-Disposition", "attachment; filename=income_data.csv")
        res.send(csvData)
    } catch (error) {
        res.status(400).json({
            success:false,  
            message:error.message
        })
    }
}

// to download income data as EXCEL
export const downloadIncomeDataExcel = async (req, res) => {
    const userId = req.user._id
    try {
        const incomes = await incomeModel.find({ userId }).sort({ date: -1 })
        const plainData = incomes.map(income => ({
            Description: income.description,
            Amount: income.amount,
            Category: income.category,
            Date: new Date(income.date).toLocaleDateString() 
        }))
        const worksheet = XLSX.utils.json_to_sheet(plainData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "incomeModel")
        XLSX.writeFile(workbook, "income_details.xlsx")
        res.download("income_details.xlsx")
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// to get income overview
export const getIncomeOverview = async (req, res) => {
    try{
        const userId = req.user._id
        const {range="monthly"} = req.query
        const {start, end} = getDateRange(range)

        const incomes = await incomeModel.find({
            userId,
            date: {
                $gte: start,
                $lte: end
            },
        }).sort({ date: -1 })
           
        const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
        const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
        const numberOfTransactions = incomes.length;
        const recentTransactions = incomes.slice(0, 9);
        res.json({
            success:true,
            totalIncome,
            averageIncome,
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
