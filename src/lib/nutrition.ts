/**
 * Nutrition calculations for NutriFit.
 *
 * BMR uses the strict Mifflin-St Jeor equation:
 *   Men:   10 * weightKg + 6.25 * heightCm - 5 * age + 5
 *   Women: 10 * weightKg + 6.25 * heightCm - 5 * age - 161
 *
 * TDEE = BMR * activity factor. As specified, we use a fixed 1.55
 * (moderate exercise 3-5 days/week) for the platform default.
 *
 * Macros split: Protein 30% / Carbs 40% / Fat 30%.
 *   protein (g) = (TDEE * 0.30) / 4
 *   carbs   (g) = (TDEE * 0.40) / 4
 *   fat     (g) = (TDEE * 0.30) / 9
 */

export type Sex = "male" | "female";

export type ExerciseType =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type DietPreference =
  | "balanced"
  | "high_protein"
  | "low_carb"
  | "vegetarian"
  | "vegan"
  | "keto";

export type Macros = {
  protein: number;
  carbs: number;
  fat: number;
};

export type UserProfile = {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  stepGoal: number;
  exerciseType: ExerciseType;
  dietPreference: DietPreference;
  targetCalories: number;
  macros: Macros;
};

/** Mifflin-St Jeor BMR. */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: Sex
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

/** TDEE = BMR * 1.55 (platform default activity factor). */
export function calculateTDEE(bmr: number): number {
  return Math.round(bmr * 1.55);
}

/** 30/40/30 macro split from a TDEE target. */
export function calculateMacros(tdee: number): Macros {
  return {
    protein: Math.round((tdee * 0.3) / 4),
    carbs: Math.round((tdee * 0.4) / 4),
    fat: Math.round((tdee * 0.3) / 9),
  };
}

/** Full profile computation from raw onboarding input. */
export function buildProfile(input: {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  stepGoal: number;
  exerciseType: ExerciseType;
  dietPreference: DietPreference;
}): UserProfile {
  const bmr = calculateBMR(input.weightKg, input.heightCm, input.age, input.sex);
  const targetCalories = calculateTDEE(bmr);
  const macros = calculateMacros(targetCalories);
  return {
    ...input,
    targetCalories,
    macros,
  };
}
