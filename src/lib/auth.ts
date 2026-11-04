import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ae_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;
const loginHits = new Map<string, number[]>();

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
    // Keep the comparison constant-time even when lengths differ.
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

export function createSessionToken() {
  const expires = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${expires}.${sign(expires)}`;
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

export async function isAuthenticated() {
  const jar = await cookies();
  return verifySessionToken(jar.get(ADMIN_COOKIE)?.value);
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
