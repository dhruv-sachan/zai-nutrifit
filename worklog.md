# NutriFit — Project Worklog

A premium, AI-powered health & nutrition platform. Built on Next.js 16 + TypeScript + Prisma (SQLite) + z-ai-web-dev-sdk, adapting the requested Vite/Express/MongoDB architecture to this environment while preserving every feature (Mifflin-St Jeor TDEE, JWT HTTP-only cookie auth, Gemini-style AI routes, Zustand state, glassmorphism UI).

---
Task ID: 1
Agent: orchestrator (main)
Task: Foundation — install deps, update Prisma schema (User + DailyLog), push DB, init worklog

Work Log:
- Installed bcryptjs@3.0.3 and jsonwebtoken@9.0.3 (+ types) for JWT HTTP-only cookie auth.
- Started Next.js dev server on port 3000 (background).
- Will define Prisma schema with User (name, email unique, password, onboardingDone, profile Json) and DailyLog (userId ref, date String, calories/protein/carbs/fat/steps/water/sleep Numbers).

Stage Summary:
- Auth deps ready. Schema design uses `Json` for the nested `profile` object (age, sex, heightCm, weightKg, stepGoal, exerciseType, dietPreference, targetCalories, macros) since SQLite/Prisma cannot store list primitives and Json cleanly models the nested object.

---
Task ID: 2-7
Agent: orchestrator (main)
Task: Backend lib + API routes + frontend state + UI components + view router + end-to-end verification

Work Log:
- `src/lib/auth.ts`: bcrypt password hashing, JWT sign/verify, HTTP-only cookie helpers (setAuthCookie / clearAuthCookie / getSession / requireAuth / AuthError). 7-day expiry, secure in prod, sameSite=lax.
- `src/lib/nutrition.ts`: Mifflin-St Jeor BMR (men: +5, women: -161), TDEE = BMR * 1.55, macros 30/40/30 (protein/4, carbs/4, fat/9). buildProfile() composes the full UserProfile.
- `src/lib/types.ts`: SafeUser, Exercise, MealEstimate shared types.
- `src/lib/ai.ts`: z-ai-web-dev-sdk wrapper (getZAI, aiComplete) + extractJSON() that strips ```json fences and scans for balanced JSON.
- API routes (all App Router route handlers):
  - POST /api/auth/register — validates, hashes, creates User, sets JWT cookie, returns safe user.
  - POST /api/auth/login — verifies credentials, sets cookie.
  - POST /api/auth/logout — clears cookie.
  - GET /api/user/profile — checkAuth via JWT, returns profile.
  - POST /api/user/onboarding — validates biometrics, computes BMR/TDEE/macros, saves profile, sets onboardingDone=true.
  - POST /api/ai/generate-workout — auth-required, passes biometrics to LLM, returns strict JSON array of exercises.
  - POST /api/ai/analyze-meal — auth-required, estimates calories/macros/items/notes from meal text.
- `src/lib/api.ts`: typed fetch client (credentials: include) for all routes.
- `src/store/useAuthStore.ts`: Zustand store — user, isAuthenticated, isCheckingAuth, view; checkAuth/login/register/logout/completeOnboarding; viewForUser() resolves landing/onboarding/dashboard.
- `src/app/globals.css`: light glassmorphism theme — slate-50 canvas, 4 animated mesh-gradient blobs (cyan/teal/emerald/sky) with mix-blend-multiply, .nf-glass / .nf-glass-soft frosted surfaces, .nf-text-gradient, .nf-btn-gradient, .nf-glow pulsing button, custom scrollbar, reduced-motion support.
- `src/app/layout.tsx`: NutriFit metadata + title.
- UI components (src/components/nutrifit/):
  - MeshBackground.tsx — floating gradient blobs.
  - Navbar.tsx — dynamic: logged-out→"Sign In", logged-in→"Dashboard"+"Sign Out".
  - Landing.tsx — hero + 3 alternating feature sections + CTA + sticky footer (flex min-h-screen flex-col + mt-auto).
  - AuthPage.tsx — split-screen brand panel + form, AnimatePresence login/register toggle, Lucide icon inputs, Eye/EyeOff password toggle.
  - Onboarding.tsx — left frosted card with AI-generated hero image + right form (Age, Gender, Height, Weight, Step Goal, Exercise Type, Diet Preference) + "Sign out & switch account" escape hatch.
  - Dashboard.tsx — 4 metric cards (Flame/TDEE, Beef/Protein, Wheat/Carbs, Droplet/Fats), body-composition strip, AI Launchpad with glowing gradient buttons (Workout Generator + Meal Analyzer) showing live results.
  - AppShell.tsx — Public/Protected view router via Zustand: unauth→landing/auth; auth+!onboarded→forced onboarding; auth+onboarded→dashboard. Loading screen while checkAuth runs.
- Generated hero image with z-ai image CLI (768x1344, wellness/fitness aesthetic).
- page.tsx renders MeshBackground + AppShell.

Verification (Agent Browser end-to-end):
- Landing renders: hero, 3 features, CTA, sticky footer. VLM confirms glassmorphism + alignment correct, no bugs.
- Auth: register → toast + redirect to onboarding. Eye toggle confirmed (password→text→password).
- Onboarding: filled Age 28 / Male / 178cm / 75kg / 10000 steps / Moderate / High Protein → "Calculate" → dashboard.
- TDEE math verified: BMR 1727.5 × 1.55 = 2678 kcal; protein 201g, carbs 268g, fat 89g. ✓ exact.
- AI Workout Generator → 200 in 10s, returned 7 exercises (Goblet Squat, Dumbbell Bench Press, Bent-Over Row, Overhead Press, Plank, RDL, Bicep Curl) with sets/reps/target/form.
- AI Meal Analyzer → 200 in 2.1s, returned 465 kcal / 42g protein / 45g carbs / 14g fat + ingredients + tip.
- Session persistence: reload keeps user on dashboard (JWT cookie). Sign Out → landing. Login (existing account) → straight to dashboard (skips onboarding).
- Mobile (390px): dashboard 2-col cards, no horizontal overflow; landing responsive. VLM-confirmed.
- ESLint: clean (0 errors). dev.log: all routes 200, no runtime errors.

Stage Summary:
- NutriFit is feature-complete and browser-verified. Stack adapted to Next.js 16 + TypeScript + Prisma(SQLite) + z-ai-web-dev-sdk while preserving every requested capability: Mifflin-St Jeor TDEE, 30/40/30 macros, JWT HTTP-only cookie auth with bcrypt, AI workout + meal routes, Zustand auth store, Public/Protected routing, and a premium light glassmorphism UI with mesh gradients, split-screen auth, frosted onboarding card with escape hatch, and a dashboard with Flame/Beef/Wheat/Droplet metric cards + AI Launchpad.
