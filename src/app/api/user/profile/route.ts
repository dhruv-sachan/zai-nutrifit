import { NextResponse } from "next/server";
import { getSession, toSafeUser } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json(toSafeUser(user));
}
