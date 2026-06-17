import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import type { SafeUser } from "@/lib/types";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const safeUser: SafeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    onboardingDone: user.onboardingDone,
    profile: (user.profile as SafeUser["profile"]) ?? null,
    createdAt: user.createdAt.toISOString(),
  };

  return NextResponse.json({ user: safeUser });
}
