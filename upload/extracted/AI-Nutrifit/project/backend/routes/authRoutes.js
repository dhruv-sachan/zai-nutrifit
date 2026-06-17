import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const router = express.Router();

const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET || "nutrifit_fallback_secret",
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // FIXED: Mapped the hashed string to the 'password' field your schema requires
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: passwordHash,
      onboardingDone: false,
    });

    generateTokenAndSetCookie(res, newUser._id);

    res.status(201).json({
      message: "Registration successful",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        onboardingDone: newUser.onboardingDone,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // FIXED: Checking against user.password to match your schema
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        onboardingDone: user.onboardingDone,
        age: user.profile?.age,
        sex: user.profile?.sex,
        height: user.profile?.heightCm,
        weight: user.profile?.weightKg,
        activityLevel: user.profile?.activityLevel,
        goal: user.profile?.goal,
        targetCalories: user.profile?.targetCalories,
        macros: user.profile?.macros,
        stepGoal: user.profile?.stepGoal,
        exerciseType: user.profile?.exerciseType,
        dietPreference: user.profile?.dietPreference,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
