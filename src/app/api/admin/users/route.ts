import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth-server";
import {
  listAdminUsers,
  createAdminUser,
  type AdminUserRole,
} from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

export async function GET() {
  if (!(await isAuthenticated())) return unauthorized();

  const users = await listAdminUsers();
  return NextResponse.json({ ok: true, items: users });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return unauthorized();

  let body: { email: string; name: string; role: AdminUserRole; password: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body.email || !body.name || !body.role || !body.password) {
    return NextResponse.json(
      { ok: false, error: "missing_fields" },
      { status: 400 },
    );
  }

  try {
    const user = await createAdminUser({
      email: body.email,
      name: body.name,
      role: body.role,
      password: body.password,
    });
    return NextResponse.json({ ok: true, data: user });
  } catch {
    return NextResponse.json(
      { ok: false, error: "create_failed", message: "تعذر إنشاء المستخدم" },
      { status: 500 },
    );
  }
}
