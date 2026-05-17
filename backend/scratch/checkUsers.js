import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/userModel.js";

async function checkUsers() {
  try {
    await connectDB();
    const users = await User.find({}, "name email isVerified otp otpExpiry");
    console.log("\n--- REGISTERED USERS IN DATABASE ---");
    if (users.length === 0) {
      console.log("No users found in database.");
    } else {
      users.forEach(user => {
        console.log(`- Name: ${user.name}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Verified: ${user.isVerified}`);
        console.log(`  Current OTP: ${user.otp}`);
        console.log(`  OTP Expiry: ${user.otpExpiry}`);
        console.log("--------------------------------");
      });
    }
  } catch (error) {
    console.error("Failed to fetch users:", error);
  } finally {
    await mongoose.connection.close();
  }
}

checkUsers();
