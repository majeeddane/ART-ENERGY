import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "ae_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;
const loginHits = new Map<string, number[]>();

type SessionPayload = {
  exp: number;
  userId?: string;
  email?: string;
  role?: string;
};

function secret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "art-energy-local-dev-secret-change-me"
  );
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) {
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function verifyPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(input, expected);
}

export function createSessionToken(user?: { id?: string; email?: string; role?: string }) {
  const expires = String(Date.now() + SESSION_MAX_AGE * 1000);
  const payload: SessionPayload = { exp: Number(expires) };
  if (user) {
    payload.userId = user.id;
    payload.email = user.email;
    payload.role = user.role;
  }
  return `${expires}.${sign(JSON.stringify(payload))}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return false;
  const index = token.lastIndexOf(".");
  if (index <= 0) return false;
  const expires = token.slice(0, index);
  const signature = token.slice(index + 1);
  if (!safeEqual(signature, sign(expires))) return false;
  const expiresAt = Number(expires);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export function decodeSessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const index = token.lastIndexOf(".");
  if (index <= 0) return null;
  const payloadPart = token.slice(index + 1);
  try {
    return JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8")) as SessionPayload;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export function loginRateLimited(ip: string) {
  const now = Date.now();
  const recent = (loginHits.get(ip) ?? []).filter(
    (time) => now - time < LOGIN_WINDOW_MS,
  );
  if (recent.length >= LOGIN_MAX_ATTEMPTS) {
    loginHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  loginHits.set(ip, recent);
  return false;
}

export function clearLoginAttempts(ip: string) {
  loginHits.delete(ip);
}
