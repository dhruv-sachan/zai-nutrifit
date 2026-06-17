import type {
  Exercise,
  MealEstimate,
  SafeUser,
  UserProfile,
  DailyLogEntry,
} from "@/lib/types";

/**
 * Bearer-token fallback for the HTTP-only JWT cookie.
 *
 * The cookie is the primary auth mechanism, but in cross-site iframe
 * previews (the Preview Panel) some browsers block third-party cookies
 * entirely. When that happens, the token returned in the login/register
 * JSON body is stored here and sent as an `Authorization: Bearer` header
 * so the session still works.
 */
const TOKEN_KEY = "nutrifit_token";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore storage errors (private mode, etc.)
  }
}

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    credentials: "include",
    headers,
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (data && typeof data === "object" &&
        ("message" in data
          ? String((data as { message: unknown }).message)
          : "error" in data
          ? String((data as { error: unknown }).error)
          : null)) || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

export const api = {
  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<{ user: SafeUser }> => {
    const res = await request<{
      user: SafeUser;
      token?: string;
      message?: string;
    }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    if (res.token) setToken(res.token);
    return { user: res.user };
  },

  login: async (
    email: string,
    password: string
  ): Promise<{ user: SafeUser }> => {
    const res = await request<{
      user: SafeUser;
      token?: string;
      message?: string;
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (res.token) setToken(res.token);
    return { user: res.user };
  },

  logout: async (): Promise<void> => {
    try {
      await request<{ message?: string }>("/api/auth/logout", {
        method: "POST",
      });
    } catch {
      // ignore network errors on logout
    }
    setToken(null);
  },

  /** GET /api/user/profile — returns the flat user object directly. */
  profile: () => request<SafeUser>("/api/user/profile", { method: "GET" }),

  onboarding: (payload: {
    age: number;
    gender?: string;
    sex?: string;
    height: number;
    weight: number;
    stepGoal: number;
    exerciseType: string;
    dietPreference: string;
  }) =>
    request<{ user: SafeUser; message?: string }>("/api/user/onboarding", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /** POST /api/user/log — upsert a daily log entry. */
  saveLog: (payload: {
    date?: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    steps?: number;
    water?: number;
    sleep?: number;
    exercises?: Exercise[];
  }) =>
    request<{ message: string; log: DailyLogEntry }>("/api/user/log", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /** GET /api/user/logs/weekly — last 7 days of logs. */
  weeklyLogs: () =>
    request<DailyLogEntry[]>("/api/user/logs/weekly", { method: "GET" }),

  generateWorkout: (payload: {
    fitnessLevel?: string;
    workoutFocus?: string;
    equipment?: string;
    userContext?: Partial<SafeUser>;
  }) =>
    request<{ success: boolean; plan: Exercise[]; exercises: Exercise[] }>(
      "/api/ai/generate-workout",
      { method: "POST", body: JSON.stringify(payload) }
    ),

  analyzeMeal: (mealDescription: string) =>
    request<{ analysis: MealEstimate; estimate: MealEstimate }>(
      "/api/ai/analyze-meal",
      { method: "POST", body: JSON.stringify({ mealDescription }) }
    ),

  /** POST /api/ai/chat — the AI Copilot. */
  chat: (payload: {
    message: string;
    userContext?: Partial<SafeUser>;
  }) =>
    request<{ reply: string }>("/api/ai/chat", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export type { SafeUser, UserProfile, Exercise, MealEstimate, DailyLogEntry };
