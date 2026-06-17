import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/chat", async (req, res) => {
  try {
    const { message, userContext } = req.body;

    const prompt = `You are the NutriFit AI assistant. Be concise, helpful, and science-backed.
User Profile: Age ${userContext?.age || "N/A"}, Weight ${userContext?.weight || "N/A"}kg, Height ${userContext?.height || "N/A"}cm, Step Goal ${userContext?.stepGoal || 10000}, Exercise ${userContext?.exerciseType || "Standard"}, Diet ${userContext?.dietPreference || "Standard Balanced"}.

User Query: "${message}"

Provide a helpful answer tailored to their metrics.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return res.status(200).json({ reply: response.text.trim() });
  } catch (error) {
    console.error("Gemini chat error:", error);
    return res.status(500).json({ error: "AI chatbot error" });
  }
});

router.post("/generate-workout", async (req, res) => {
  try {
    const { fitnessLevel, workoutFocus, equipment, userContext } = req.body;

    const prompt = `You are the core fitness engine for NutriFit AI.
Generate a customized daily workout routine based on:
- Experience: ${fitnessLevel || "Intermediate"}
- Focus: ${workoutFocus || "Hypertrophy Strength"}
- Equipment: ${equipment || "Dumbbells Only"}
- User: Age ${userContext?.age || 25}, Weight ${userContext?.weight || 70}kg, Height ${userContext?.height || 175}cm

Return ONLY a valid JSON array. No markdown code blocks:
[
  {
    "id": "ex_1",
    "name": "Exercise name",
    "sets": 3,
    "reps": 12,
    "target": "Muscle group",
    "form": "How to perform correctly",
    "avoid": "Safety risks to avoid"
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let responseText = response.text.trim();
    if (responseText.startsWith("```json")) {
      responseText = responseText
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
    } else if (responseText.startsWith("```")) {
      responseText = responseText
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();
    }

    const workoutPlan = JSON.parse(responseText);
    return res.status(200).json({ success: true, plan: workoutPlan });
  } catch (error) {
    console.error("Workout generation error:", error);
    return res.status(500).json({
      success: false,
      message: "AI engine failed",
      error: error.message,
    });
  }
});

router.post("/analyze-meal", async (req, res) => {
  try {
    const { mealDescription } = req.body;

    if (!mealDescription || mealDescription.trim().length === 0) {
      return res.status(400).json({ message: "Meal description is required" });
    }

    const prompt = `You are an expert nutritionist. Analyze this meal and return nutritional estimates.

Meal: "${mealDescription}"

Return ONLY valid JSON:
{
  "calories": number_in_kcal,
  "protein": number_in_grams,
  "carbs": number_in_grams,
  "fat": number_in_grams,
  "tip": "One practical nutrition tip"
}

Be realistic with estimates.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text.trim();
    if (text.startsWith("```json")) {
      text = text
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
    } else if (text.startsWith("```")) {
      text = text.replace(/^```/, "").replace(/```$/, "").trim();
    }

    let analysis;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch {
      analysis = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        tip: "Could not analyze. Try being more specific.",
      };
    }

    return res.status(200).json({ analysis });
  } catch (error) {
    console.error("Meal analysis error:", error);
    return res.status(500).json({ error: "Meal analysis failed" });
  }
});

export default router;
