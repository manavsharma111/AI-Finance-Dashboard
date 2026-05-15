import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/userModel.js";

const TEST_USER = {
  name: "Test",
  email: "test@gmail.com",
  password: "7894561230",
};

async function seedTestUser() {
  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash(TEST_USER.password, 10);

    const user = await User.findOneAndUpdate(
      { email: TEST_USER.email },
      {
        name: TEST_USER.name,
        email: TEST_USER.email,
        password: hashedPassword,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log("Test user ready:");
    console.log({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error("Failed to seed test user:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seedTestUser();
