import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "nutrifit-dev-secret-change-in-production";
const COOKIE_NAME = "nutrifit_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionUser = {
  id: string;
  email: string;
  name: string;
};

/** Hash a plaintext password using bcrypt. */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/** Verify a plaintext password against a bcrypt hash. */
export async function verifyPassword(
  password: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

/** Sign a JWT for a user and set it as an HTTP-only cookie. */
export async function setAuthCookie(user: SessionUser): Promise<void> {
  const token = jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

/** Clear the auth cookie (logout). */
export async function clearAuthCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Read & verify the JWT from the cookie. Returns the user document or null. */
export async function getSession() {
  try {
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & {
      sub: string;
    };
    if (!decoded?.sub) return null;

    const user = await db.user.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        name: true,
        email: true,
        onboardingDone: true,
        profile: true,
        createdAt: true,
      },
    });
    return user;
  } catch {
    return null;
  }
}

/** Require an authenticated session or throw a 401-ish error. */
export async function requireAuth() {
  const user = await getSession();
  if (!user) {
    throw new AuthError("Unauthorized — please sign in.", 401);
  }
  return user;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export { COOKIE_NAME };
