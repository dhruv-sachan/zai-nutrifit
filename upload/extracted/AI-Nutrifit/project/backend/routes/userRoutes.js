import express from "express";
import jwt from "jsonwebtoken";

// 1. IMPORT YOUR MODELS DIRECTLY (No more dbManager needed!)
import User from "../models/User.js";
import DailyLog from "../models/DailyLog.js";

const router = express.Router();

// --- AUTH MIDDLEWARE ---
const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.token || req.cookies?.jwt;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "nutrifit_fallback_secret",
    );

    // 2. USE THE MODEL DIRECTLY
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(401).json({ message: "User not found" });

    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ==========================================
// USER PROFILE & ONBOARDING ROUTES
// ==========================================

// GET /api/user/profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    res.json({
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
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT /api/user/profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      age,
      weight,
      height,
      stepGoal,
      exerciseType,
      dietPreference,
      targetCalories,
      macros,
    } = req.body;

    // USE THE MODEL DIRECTLY
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const update = { ...user._doc }; // use _doc to safely spread mongoose object
    if (name) update.name = name;

    if (!user.profile) {
      update.profile = {
        age: age || 25,
        sex: "male",
        heightCm: height || 170,
        weightKg: weight || 70,
        activityLevel: "moderate",
        goal: "maintain",
        targetCalories: targetCalories || 2200,
        macros: macros || { protein: 150, carbs: 220, fat: 70 },
        stepGoal: stepGoal || 10000,
        exerciseType: exerciseType || "Core Stability",
        dietPreference: dietPreference || "Standard Balanced",
      };
    } else {
      update.profile = { ...user.profile };
      if (age !== undefined) update.profile.age = age;
      if (weight !== undefined) update.profile.weightKg = weight;
      if (height !== undefined) update.profile.heightCm = height;
      if (stepGoal !== undefined) update.profile.stepGoal = stepGoal;
      if (exerciseType !== undefined)
        update.profile.exerciseType = exerciseType;
      if (dietPreference !== undefined)
        update.profile.dietPreference = dietPreference;
      if (targetCalories !== undefined)
        update.profile.targetCalories = targetCalories;
      if (macros !== undefined) update.profile.macros = macros;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: update,
      },
      { new: true },
    );

    res.json({
      message: "Profile updated",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        onboardingDone: updatedUser.onboardingDone,
        ...updatedUser.profile,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/user/onboarding
router.post("/onboarding", authMiddleware, async (req, res) => {
  try {
    const {
      age,
      gender,
      weight,
      height,
      stepGoal,
      exerciseType,
      dietPreference,
    } = req.body;

    const sex = gender || "male";
    const heightCm = Number(height) || 170;
    const weightKg = Number(weight) || 70;
    const userAge = Number(age) || 25;

    // Accurate Mifflin-St Jeor Equation
    let bmr;
    if (sex === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * userAge + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * userAge - 161;
    }

    // TDEE Calculation
    const tdee = Math.round(bmr * 1.55);
    const macros = {
      protein: Math.round((tdee * 0.3) / 4),
      carbs: Math.round((tdee * 0.4) / 4),
      fat: Math.round((tdee * 0.3) / 9),
    };

    // USE THE MODEL DIRECTLY
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          onboardingDone: true,
          profile: {
            age: userAge,
            sex,
            heightCm,
            weightKg,
            activityLevel: "moderate",
            goal: "maintain",
            targetCalories: tdee,
            macros,
            stepGoal: Number(stepGoal) || 10000,
            exerciseType: exerciseType || "Core Stability & Rehabilitation",
            dietPreference: dietPreference || "Standard Balanced Macro Split",
          },
        },
      },
      { new: true },
    );

    res.json({
      message: "Onboarding complete",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        onboardingDone: true,
        age: userAge,
        sex,
        height: heightCm,
        weight: weightKg,
        targetCalories: tdee,
        macros,
        stepGoal: Number(stepGoal) || 10000,
        exerciseType: exerciseType || "Core Stability & Rehabilitation",
        dietPreference: dietPreference || "Standard Balanced Macro Split",
      },
    });
  } catch (err) {
    console.error("Onboarding error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ==========================================
// USER LOGGING ROUTES
// ==========================================

// POST /api/user/log
router.post("/log", authMiddleware, async (req, res) => {
  try {
    const {
      date,
      calories,
      protein,
      carbs,
      fat,
      steps,
      water,
      sleep,
      exercises,
    } = req.body;

    const today = date || new Date().toISOString().split("T")[0];

    // USE DAILYLOG MODEL DIRECTLY
    const log = await DailyLog.findOneAndUpdate(
      { userId: req.userId, date: today },
      {
        $set: {
          calories: calories || 0,
          protein: protein || 0,
          carbs: carbs || 0,
          fat: fat || 0,
          steps: steps || 0,
          water: water || 0,
          sleep: sleep || 0,
          exercises: exercises || [],
        },
      },
      { upsert: true, new: true },
    );

    res.json({ message: "Log saved", log });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/user/logs/weekly
router.get("/logs/weekly", authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const todayStr = today.toISOString().split("T")[0];
    const weekAgoStr = weekAgo.toISOString().split("T")[0];

    // USE DAILYLOG MODEL DIRECTLY
    const logs = await DailyLog.find({
      userId: req.userId,
      date: { $gte: weekAgoStr, $lte: todayStr },
    });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
