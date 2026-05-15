import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    aiInsights: {
        type: String,
        default: ""
    },
    lastInsightsDate: {
        type: Date,
        default: null
    }
})

const userModel = mongoose.models.user || mongoose.model("user", userSchema)
export default userModel