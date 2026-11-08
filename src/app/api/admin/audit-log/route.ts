import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth-server";
import { listAdminAuditLog } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!(await isAuthenticated())) return unauthorized();

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
  const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);
  const userId = searchParams.get("userId") || undefined;
  const action = searchParams.get("action") || undefined;

  const items = await listAdminAuditLog({ limit, offset, userId, action });
  return NextResponse.json({ ok: true, items, limit, offset });
}
