import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth-server";
import {
  listContactInquiries,
  getContactInquiryCount,
} from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!(await isAuthenticated())) return unauthorized();

  const { searchParams } = new URL(request.url);
  const rawStatus = searchParams.get("status");
  const status = (rawStatus === "new" || rawStatus === "reviewing" || rawStatus === "contacted" || rawStatus === "completed" || rawStatus === "closed")
    ? rawStatus
    : undefined;
  const search = searchParams.get("search") || undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
  const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);

  const [items, total] = await Promise.all([
    listContactInquiries({ status, search, limit, offset }),
    getContactInquiryCount({ status, search }),
  ]);

  return NextResponse.json({ ok: true, items, total, limit, offset });
}
