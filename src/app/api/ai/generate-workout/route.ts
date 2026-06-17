import { NextResponse } from "next/server";
import { getSession, AuthError } from "@/lib/auth";
import { aiComplete, extractJSON } from "@/lib/ai";
import type { Exercise, UserProfile } from "@/lib/types";
import type { DietPreference } from "@/lib/nutrition";

export async function POST(request: Request) {
  try {
    const user = await getSession();
    if (!user) {
      throw new AuthError("Unauthorized — please sign in.", 401);
    }

    const profile = (user.profile as UserProfile | null) ?? null;
    if (!profile) {
      throw new AuthError(
        "Please complete onboarding before generating a workout.",
        400
      );
    }

    const body = await request.json().catch(() => ({}));
    const focus = String(body?.focus ?? "general fitness").trim().slice(0, 120);
    const duration = Number(body?.duration ?? 45);

    const systemPrompt =
      "You are NutriFit AI, an elite certified personal trainer and exercise scientist. " +
      "You design safe, effective, progressive workout plans tailored to a person's biometrics and goals. " +
      "You ALWAYS respond with strictly valid JSON — no markdown, no commentary.";

    const userPrompt = `Design a single workout session for this person.
Biometrics & goal:
- Age: ${profile.age}
- Sex: ${profile.sex}
- Height: ${profile.heightCm} cm
- Weight: ${profile.weightKg} kg
- Activity level: ${profile.exerciseType}
- Diet: ${profile.dietPreference}
- Daily target calories (TDEE): ${profile.targetCalories}
- Daily step goal: ${profile.stepGoal}
- Session focus: ${focus}
- Approximate session duration: ${duration} minutes

Return STRICTLY a JSON array of 5 to 8 exercises. Each exercise object MUST have exactly these keys:
- "id": a unique integer (1, 2, 3, ...)
- "name": short exercise name (string)
- "sets": number of sets (integer)
- "reps": reps or rep range as a string e.g. "8-12" or "30s"
- "target": primary muscle group targeted (string)
- "form": one concise sentence on proper form (string)

Respond with ONLY the JSON array. Do not wrap it in markdown fences.`;

    const raw = await aiComplete(systemPrompt, userPrompt);
    const exercises = extractJSON<Exercise[]>(raw);

    if (!Array.isArray(exercises) || exercises.length === 0) {
      throw new AuthError("Could not generate a workout. Please try again.", 502);
    }

    return NextResponse.json({ exercises });
  } catch (err) {
    const status = err instanceof AuthError ? err.status : 500;
    const message =
      err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status });
  }
}
