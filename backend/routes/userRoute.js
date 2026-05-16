import express from "express"
import { getCurrentUser, loginUser, registerUser, updatePassword, updateProfile, verifyOTP, resendOTP } from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js"


const userRouter = express.Router()
 
userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/verify-otp", verifyOTP)
userRouter.post("/resend-otp", resendOTP)

// protected routes

userRouter.get("/me", authMiddleware, getCurrentUser)
userRouter.put("/profile", authMiddleware, updateProfile)
userRouter.put("/password", authMiddleware, updatePassword)

export default userRouter
