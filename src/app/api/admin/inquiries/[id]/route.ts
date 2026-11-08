import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth-server";
import {
  updateContactInquiryStatus,
  deleteContactInquiry,
  type ContactInquiry,
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
  let body: { status?: ContactInquiry["status"]; internal_notes?: string };
  try {
    body = (await request.json()) as { status?: ContactInquiry["status"]; internal_notes?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const inquiry = await updateContactInquiryStatus(id, body.status ?? "new", body.internal_notes);
  if (!inquiry) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, data: inquiry });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) return unauthorized();

  const { id } = await params;
  const deleted = await deleteContactInquiry(id);
  if (!deleted) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
