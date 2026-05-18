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
    forgotPasswordToken: {
        type: String,
        default: null
    },
    forgotPasswordExpiry: {
        type: Date,
        default: null
    },
    aiInsights: {
        type: String,
        default: ""
    },
    lastInsightsDate: {
        type: Date,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    }
})

const userModel = mongoose.models.user || mongoose.model("user", userSchema)
export default userModel