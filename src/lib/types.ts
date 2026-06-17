import type { UserProfile } from "@/lib/nutrition";

/** Shape of a user returned to the frontend (never includes password). */
export type SafeUser = {
  id: string;
  name: string;
  email: string;
  onboardingDone: boolean;
  profile: UserProfile | null;
  createdAt: string;
};

/** A single exercise returned by the AI workout generator. */
export type Exercise = {
  id: number | string;
  name: string;
  sets: number;
  reps: number | string;
  target: string;
  form: string;
};

/** Meal macro estimate returned by the AI meal analyzer. */
export type MealEstimate = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items?: string[];
  notes?: string;
};
