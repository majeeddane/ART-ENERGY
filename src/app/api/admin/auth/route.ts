import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminConfigured,
  clearLoginAttempts,
  createSessionToken,
  isAuthenticated,
  loginRateLimited,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function ipOf(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

export async function GET() {
  return NextResponse.json({
    configured: adminConfigured(),
    authenticated: await isAuthenticated(),
  });
}

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "not_configured",
        message:
          "أضف ADMIN_PASSWORD إلى متغيرات البيئة أولًا (انظر README قسم لوحة التحكم).",
      },
      { status: 503 },
    );
  }

  const ip = ipOf(request);
  if (loginRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", message: "محاولات كثيرة. انتظر 10 دقائق." },
      { status: 429 },
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  if (!password) {
    return NextResponse.json(
      { ok: false, error: "missing_password", message: "أدخل كلمة المرور." },
      { status: 400 },
    );
  }

  if (!verifyPassword(password)) {
    return NextResponse.json(
      { ok: false, error: "invalid_password", message: "كلمة المرور غير صحيحة." },
      { status: 401 },
    );
  }

  clearLoginAttempts(ip);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    ADMIN_COOKIE,
    createSessionToken(),
    sessionCookieOptions(),
  );
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", {
    ...sessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}
