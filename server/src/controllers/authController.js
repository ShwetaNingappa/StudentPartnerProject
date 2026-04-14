import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      // initialize common objects to avoid missing-object crashes elsewhere
      categoryPerformance: {},
      solvedCodingQuestions: [],
      customTasks: [],
      totalScore: 0,
      dailyStreak: 0
    });

    return res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("signup error:", error);
    return res.status(500).json({ message: error.message || "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({ message: error.message || "Login failed" });
  }
};

export const me = async (req, res) => {
  res.json(req.user);
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    // Return a generic response even when user does not exist.
    if (!user) {
      return res.json({ message: "If an account exists for this email, an OTP has been sent." });
    }

    const otp = String(crypto.randomInt(100000, 1000000));
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetPasswordOTP = otpHash;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your Smart Placement password reset OTP is ${otp}. It expires in 10 minutes.`,
      html: `<p>Your Smart Placement password reset OTP is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`
    });

    return res.json({ message: "If an account exists for this email, an OTP has been sent." });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to send OTP" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const otpHash = crypto.createHash("sha256").update(String(otp)).digest("hex");

    const user = await User.findOne({
      email,
      resetPasswordOTP: otpHash,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOTP = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.json({ message: "Password reset successful. Please login with your new password." });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to reset password" });
  }
};
