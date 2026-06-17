import type {
  Exercise,
  MealEstimate,
  SafeUser,
  UserProfile,
} from "@/lib/types";

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : null) || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

export const api = {
  register: (name: string, email: string, password: string) =>
    request<{ user: SafeUser }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ user: SafeUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    request<{ success: boolean }>("/api/auth/logout", { method: "POST" }),

  profile: () =>
    request<{ user: SafeUser }>("/api/user/profile", { method: "GET" }),

  onboarding: (payload: {
    age: number;
    sex: string;
    heightCm: number;
    weightKg: number;
    stepGoal: number;
    exerciseType: string;
    dietPreference: string;
  }) =>
    request<{ user: SafeUser }>("/api/user/onboarding", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  generateWorkout: (focus: string, duration: number) =>
    request<{ exercises: Exercise[] }>("/api/ai/generate-workout", {
      method: "POST",
      body: JSON.stringify({ focus, duration }),
    }),

  analyzeMeal: (meal: string) =>
    request<{ estimate: MealEstimate }>("/api/ai/analyze-meal", {
      method: "POST",
      body: JSON.stringify({ meal }),
    }),
};

export type { SafeUser, UserProfile, Exercise, MealEstimate };
