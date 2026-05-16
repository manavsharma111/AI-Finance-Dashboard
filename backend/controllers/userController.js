import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { sendOTP } from "../utlis/mail.js";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES = "24h";
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const createToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

export async function registerUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: "Invalid email." });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "User already registered." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    const user = await User.create({ 
      name, 
      email, 
      password: hashed,
      otp,
      otpExpiry
    });

    const emailSent = await sendOTP(email, otp);

    return res.status(201).json({
      success: true,
      message: emailSent ? "Registration successful. Please verify your email with the OTP sent." : "Registration successful, but failed to send OTP. Please try requesting a new one.",
      requiresVerification: true,
      email: user.email
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    if (!user.isVerified) {
      // If not verified, generate new OTP and send
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      await sendOTP(user.email, otp);

      return res.status(403).json({ 
        success: false, 
        message: "Email not verified. A new OTP has been sent to your email.",
        requiresVerification: true,
        email: user.email
      });
    }

    const token = createToken(user._id);
    return res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getCurrentUser(req, res) {
  try {
    if (!req.user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    return res.json({ success: true, user: req.user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function updateProfile(req, res) {
  const { name, email } = req.body;

  if (!name || !email || !isValidEmail(email)) {
    return res.status(400).json({ success: false, message: "Valid name and email are required." });
  }

  try {
    const exists = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already in use." });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true }
    ).select("name email");

    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function updatePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || currentPassword === newPassword || newPassword.length < 8) {
    return res.status(400).json({ success: false, message: "Invalid password input." });
  }

  try {
    const user = await User.findById(req.user.id).select("password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ success: false, message: "Current password is incorrect." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ success: true, message: "Password changed." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function verifyOTP(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "User is already verified." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ success: false, message: "OTP has expired." });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = createToken(user._id);

    return res.json({
      success: true,
      message: "Email verified successfully.",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("OTP Verification error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function resendOTP(req, res) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "User is already verified." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        const emailSent = await sendOTP(email, otp);
        if (!emailSent) {
            return res.status(500).json({ success: false, message: "Failed to send email." });
        }

        return res.json({ success: true, message: "New OTP sent to your email." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
