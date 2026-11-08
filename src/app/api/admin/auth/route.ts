import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminConfigured,
  clearLoginAttempts,
  createSessionToken,
  loginRateLimited,
  sessionCookieOptions,
} from "@/lib/auth";
import { isAuthenticated, verifyAdminLogin } from "@/lib/auth-server";

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

  let email = "";
  let password = "";
  try {
    const body = (await request.json()) as { email?: unknown; password?: unknown };
    email = typeof body.email === "string" ? body.email : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "missing_fields", message: "أدخل البريد الإلكتروني وكلمة المرور." },
      { status: 400 },
    );
  }

  const user = await verifyAdminLogin({ email, password });
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "invalid_credentials", message: "البريد الإلكتروني أو كلمة المرور غير صحيحة." },
      { status: 401 },
    );
  }

  clearLoginAttempts(ip);
  const response = NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
  response.cookies.set(
    ADMIN_COOKIE,
    createSessionToken(user),
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
