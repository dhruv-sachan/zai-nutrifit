"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Loader2 } from "lucide-react";
import { useAuthStore, type AppView } from "@/store/useAuthStore";
import { Landing } from "./Landing";
import { AuthPage } from "./AuthPage";
import { Onboarding } from "./Onboarding";
import { Dashboard } from "./Dashboard";

/**
 * View router — implements the Public/Protected route contract:
 *  - Public views (landing, auth): authenticated users are redirected
 *    to onboarding (if incomplete) or dashboard.
 *  - Protected views (onboarding, dashboard): unauthenticated users are
 *    sent to auth; authenticated-but-not-onboarded users are forced to
 *    onboarding.
 */
function resolveView(
  isAuthenticated: boolean,
  onboardingDone: boolean,
  requested: AppView
): AppView {
  if (!isAuthenticated) {
    return requested === "auth" ? "auth" : "landing";
  }
  if (!onboardingDone) {
    return "onboarding";
  }
  return "dashboard";
}

export function AppShell() {
  const { isAuthenticated, user, view, isCheckingAuth, hasChecked, checkAuth } =
    useAuthStore();

  useEffect(() => {
    if (!hasChecked) {
      void checkAuth();
    }
  }, [hasChecked, checkAuth]);

  const effectiveView = resolveView(
    isAuthenticated,
    user?.onboardingDone ?? false,
    view
  );

  const showLoader = isCheckingAuth && !hasChecked;

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex min-h-screen items-center justify-center"
          >
            <div className="nf-glass flex flex-col items-center gap-4 rounded-3xl px-10 py-8">
              <span className="flex size-12 items-center justify-center rounded-2xl nf-btn-gradient">
                <Activity className="size-6 text-white" />
              </span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading NutriFit…
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={effectiveView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {effectiveView === "landing" && <Landing />}
            {effectiveView === "auth" && <AuthPage />}
            {effectiveView === "onboarding" && <Onboarding />}
            {effectiveView === "dashboard" && <Dashboard />}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
