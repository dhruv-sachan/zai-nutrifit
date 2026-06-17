"use client";

import { create } from "zustand";
import { api, setToken } from "@/lib/api";
import type { SafeUser } from "@/lib/types";

export type AppView = "landing" | "auth" | "onboarding" | "dashboard";

type AuthState = {
  user: SafeUser | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  view: AppView;
  hasChecked: boolean;

  // navigation
  setView: (view: AppView) => void;

  // lifecycle
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<SafeUser>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<SafeUser>;
  logout: () => Promise<void>;
  completeOnboarding: (payload: {
    age: number;
    sex: string;
    heightCm: number;
    weightKg: number;
    stepGoal: number;
    exerciseType: string;
    dietPreference: string;
  }) => Promise<SafeUser>;

  /** Decide the correct view from the current user state. */
  resolveView: () => AppView;
};

function viewForUser(user: SafeUser | null): AppView {
  if (!user) return "landing";
  return user.onboardingDone ? "dashboard" : "onboarding";
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  view: "landing",
  hasChecked: false,

  setView: (view) => set({ view }),

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const { user } = await api.profile();
      set({
        user,
        isAuthenticated: true,
        view: viewForUser(user),
        isCheckingAuth: false,
        hasChecked: true,
      });
    } catch {
      // Stale or missing token — clear it so we don't keep sending it.
      setToken(null);
      set({
        user: null,
        isAuthenticated: false,
        view: "landing",
        isCheckingAuth: false,
        hasChecked: true,
      });
    }
  },

  login: async (email, password) => {
    const { user } = await api.login(email, password);
    set({ user, isAuthenticated: true, view: viewForUser(user) });
    return user;
  },

  register: async (name, email, password) => {
    const { user } = await api.register(name, email, password);
    set({ user, isAuthenticated: true, view: viewForUser(user) });
    return user;
  },

  logout: async () => {
    try {
      await api.logout();
    } catch {
      // ignore network errors on logout
    }
    set({
      user: null,
      isAuthenticated: false,
      view: "landing",
    });
  },

  completeOnboarding: async (payload) => {
    const { user } = await api.onboarding(payload);
    set({ user, view: "dashboard" });
    return user;
  },

  resolveView: () => viewForUser(get().user),
}));
