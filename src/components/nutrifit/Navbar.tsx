"use client";

import { motion } from "framer-motion";
import { Activity, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Dynamic navbar.
 * - Logged out → "Sign In"
 * - Logged in, onboarding done → "Dashboard" + "Sign Out"
 * - Logged in, onboarding incomplete → "Sign Out"
 */
export function Navbar() {
  const { isAuthenticated, user, view, setView, logout } = useAuthStore();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-40 w-full"
    >
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <nav className="nf-glass flex items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
          <button
            onClick={() => setView(isAuthenticated && user?.onboardingDone ? "dashboard" : "landing")}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <span className="flex size-9 items-center justify-center rounded-xl nf-btn-gradient">
              <Activity className="size-5 text-white" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Nutri<span className="nf-text-gradient">Fit</span>
            </span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && user?.onboardingDone && view !== "dashboard" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView("dashboard")}
                className="gap-1.5"
              >
                <LayoutDashboard className="size-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            )}

            {isAuthenticated ? (
              <>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  Hi, {user?.name?.split(" ")[0]}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout()}
                  className="gap-1.5"
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={() => setView("auth")}
                className="nf-btn-gradient gap-1.5 border-0"
              >
                <Sparkles className="size-4" />
                Sign In
              </Button>
            )}
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
