"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";

type Mode = "login" | "register";

export function AuthPage() {
  const { login, register, setView } = useAuthStore();
  const { toast } = useToast();

  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "register") {
        await register(name, email, password);
        toast({ title: "Welcome to NutriFit!", description: "Your account is ready." });
      } else {
        await login(email, password);
        toast({ title: "Welcome back!", description: "You're signed in." });
      }
    } catch (err) {
      toast({
        title: "Authentication failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setShowPassword(false);
    setPassword("");
  }

  return (
    <div className="relative z-10 min-h-screen">
      {/* minimal top bar */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-5">
        <button
          onClick={() => setView("landing")}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back home
        </button>
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg nf-btn-gradient">
            <Activity className="size-4 text-white" />
          </span>
          <span className="font-semibold tracking-tight">
            Nutri<span className="nf-text-gradient">Fit</span>
          </span>
        </div>
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:gap-16">
        {/* Left — brand panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="nf-glass relative hidden overflow-hidden rounded-3xl p-10 lg:flex lg:flex-col lg:justify-between lg:min-h-[560px]"
        >
          <div className="absolute -left-16 -top-16 size-56 rounded-full bg-brand-cyan/25 blur-3xl" />
          <div className="absolute -bottom-20 -right-10 size-64 rounded-full bg-brand-emerald/25 blur-3xl" />

          <div className="relative">
            <span className="nf-glass-soft inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
              <Activity className="size-3.5" />
              Precision Health Platform
            </span>
            <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight">
              Train smarter.
              <br />
              Eat sharper.
              <br />
              <span className="nf-text-gradient">Powered by AI.</span>
            </h2>
            <p className="mt-4 max-w-sm text-muted-foreground">
              One account unlocks personalized macro targets, AI-built workouts,
              and instant meal intelligence.
            </p>
          </div>

          <div className="relative mt-10 grid grid-cols-3 gap-4">
            {[
              { k: "Mifflin-St Jeor", v: "BMR engine" },
              { k: "Gemini-class", v: "AI planner" },
              { k: "30/40/30", v: "Macro split" },
            ].map((s) => (
              <div key={s.k} className="nf-glass-soft rounded-2xl p-3">
                <div className="text-sm font-semibold">{s.k}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — form */}
        <div className="relative">
          <div className="nf-glass rounded-3xl p-6 sm:p-8">
            <div className="mb-6 flex rounded-xl bg-white/40 p-1">
              {(["login", "register"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`relative flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    mode === m
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode === m && (
                    <motion.span
                      layoutId="auth-tab"
                      className="absolute inset-0 rounded-lg bg-white shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">
                    {m === "login" ? "Sign In" : "Create Account"}
                  </span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {mode === "login" ? "Welcome back" : "Create your account"}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {mode === "login"
                      ? "Sign in to continue to your dashboard."
                      : "Start your personalized health journey in seconds."}
                  </p>
                </div>

                {mode === "register" && (
                  <Field
                    id="name"
                    label="Full Name"
                    icon={<User className="size-4" />}
                  >
                    <Input
                      id="name"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9"
                      autoComplete="name"
                      required
                    />
                  </Field>
                )}

                <Field
                  id="email"
                  label="Email Address"
                  icon={<Mail className="size-4" />}
                >
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    autoComplete="email"
                    required
                  />
                </Field>

                <Field
                  id="password"
                  label="Password"
                  icon={<Lock className="size-4" />}
                >
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10"
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </Field>

                <Button
                  type="submit"
                  disabled={loading}
                  className="nf-btn-gradient mt-2 w-full border-0"
                >
                  {loading
                    ? "Please wait…"
                    : mode === "login"
                    ? "Sign In"
                    : "Create Account"}
                  {!loading && <ArrowRight className="size-4" />}
                </Button>

                <p className="pt-2 text-center text-sm text-muted-foreground">
                  {mode === "login"
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => switchMode(mode === "login" ? "register" : "login")}
                    className="font-medium text-accent-foreground underline-offset-4 hover:underline"
                  >
                    {mode === "login" ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </motion.form>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  icon,
  children,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}
