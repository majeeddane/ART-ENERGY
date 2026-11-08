import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth-server";
import {
  updateAdminUserRole,
  deleteAdminUser,
  type AdminUserRole,
} from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) return unauthorized();

  const { id } = await params;
  let body: { role?: AdminUserRole; is_active?: boolean };
  try {
    body = (await request.json()) as { role?: AdminUserRole; is_active?: boolean };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  try {
    const user = await updateAdminUserRole(id, body.role ?? "viewer", body.is_active ?? true);
    if (!user) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data: user });
  } catch {
    return NextResponse.json(
      { ok: false, error: "update_failed", message: "تعذر تحديث المستخدم" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) return unauthorized();

  const { id } = await params;
  try {
    const deleted = await deleteAdminUser(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "delete_failed", message: "تعذر حذف المستخدم" },
      { status: 500 },
    );
  }
}
