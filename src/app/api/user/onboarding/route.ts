import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, AuthError } from "@/lib/auth";
import { buildProfile } from "@/lib/nutrition";
import type { SafeUser } from "@/lib/types";
import type {
  Sex,
  ExerciseType,
  DietPreference,
  UserProfile,
} from "@/lib/nutrition";

const SEXES: Sex[] = ["male", "female"];
const EXERCISES: ExerciseType[] = [
  "sedentary",
  "light",
  "moderate",
  "active",
  "very_active",
];
const DIETS: DietPreference[] = [
  "balanced",
  "high_protein",
  "low_carb",
  "vegetarian",
  "vegan",
  "keto",
];

export async function POST(request: Request) {
  try {
    const user = await getSession();
    if (!user) {
      throw new AuthError("Unauthorized — please sign in.", 401);
    }

    const body = await request.json().catch(() => ({}));
    const age = Number(body?.age);
    const heightCm = Number(body?.heightCm);
    const weightKg = Number(body?.weightKg);
    const stepGoal = Number(body?.stepGoal);
    const sex = String(body?.sex ?? "") as Sex;
    const exerciseType = String(body?.exerciseType ?? "") as ExerciseType;
    const dietPreference = String(body?.dietPreference ?? "") as DietPreference;

    if (
      !Number.isFinite(age) ||
      age < 5 ||
      age > 120 ||
      !Number.isFinite(heightCm) ||
      heightCm < 80 ||
      heightCm > 260 ||
      !Number.isFinite(weightKg) ||
      weightKg < 25 ||
      weightKg > 400 ||
      !Number.isFinite(stepGoal) ||
      stepGoal < 0 ||
      stepGoal > 100000 ||
      !SEXES.includes(sex) ||
      !EXERCISES.includes(exerciseType) ||
      !DIETS.includes(dietPreference)
    ) {
      throw new AuthError("Please complete all fields with valid values.", 400);
    }

    const profile: UserProfile = buildProfile({
      age,
      sex,
      heightCm,
      weightKg,
      stepGoal,
      exerciseType,
      dietPreference,
    });

    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        onboardingDone: true,
        profile: profile as unknown as object,
      },
    });

    const safeUser: SafeUser = {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      onboardingDone: updated.onboardingDone,
      profile: (updated.profile as SafeUser["profile"]) ?? null,
      createdAt: updated.createdAt.toISOString(),
    };

    return NextResponse.json({ user: safeUser });
  } catch (err) {
    const status = err instanceof AuthError ? err.status : 500;
    const message =
      err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status });
  }
}
