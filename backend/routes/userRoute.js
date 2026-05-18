import express from "express"
import { getCurrentUser, loginUser, registerUser, updatePassword, updateProfile, verifyOTP, resendOTP, forgotPassword, verifyForgotPasswordOTP, resetPassword } from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js"


const userRouter = express.Router()
 
userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/verify-otp", verifyOTP)
userRouter.post("/resend-otp", resendOTP)
userRouter.post("/forgot-password", forgotPassword)
userRouter.post("/verify-forgot-otp", verifyForgotPasswordOTP)
userRouter.post("/reset-password", resetPassword)

// protected routes

userRouter.get("/me", authMiddleware, getCurrentUser)
userRouter.put("/profile", authMiddleware, updateProfile)
userRouter.put("/password", authMiddleware, updatePassword)

export default userRouter
