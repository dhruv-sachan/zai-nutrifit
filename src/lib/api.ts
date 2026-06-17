import type {
  Exercise,
  MealEstimate,
  SafeUser,
  UserProfile,
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
      (data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : null) || `Request failed (${res.status})`;
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
    const res = await request<{ user: SafeUser; token: string }>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      }
    );
    setToken(res.token);
    return { user: res.user };
  },

  login: async (
    email: string,
    password: string
  ): Promise<{ user: SafeUser }> => {
    const res = await request<{ user: SafeUser; token: string }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );
    setToken(res.token);
    return { user: res.user };
  },

  logout: async (): Promise<{ success: boolean }> => {
    const res = await request<{ success: boolean }>("/api/auth/logout", {
      method: "POST",
    });
    setToken(null);
    return res;
  },

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
