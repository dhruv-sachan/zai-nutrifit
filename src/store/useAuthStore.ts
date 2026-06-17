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

  setView: (view: AppView) => void;
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
    gender?: string;
    sex?: string;
    height: number;
    weight: number;
    stepGoal: number;
    exerciseType: string;
    dietPreference: string;
  }) => Promise<SafeUser>;
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
      // GET /api/user/profile returns the flat user object directly.
      const user = await api.profile();
      set({
        user,
        isAuthenticated: true,
        view: viewForUser(user),
        isCheckingAuth: false,
        hasChecked: true,
      });
    } catch {
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
    await api.logout();
    set({ user: null, isAuthenticated: false, view: "landing" });
  },

  completeOnboarding: async (payload) => {
    const { user } = await api.onboarding(payload);
    // Inject fresh user directly (mirrors the original Onboarding.jsx
    // pattern that bypasses cached GET /profile).
    set({ user, isAuthenticated: true, view: "dashboard" });
    return user;
  },

  resolveView: () => viewForUser(get().user),
}));
