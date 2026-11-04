import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { SiteData } from "@content/site";
import { isAuthenticated } from "@/lib/auth";
import { readSiteData, saveSiteData } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json(
    { ok: false, error: "unauthorized" },
    { status: 401 },
  );
}

export async function GET() {
  if (!(await isAuthenticated())) return unauthorized();
  const data = await readSiteData();
  return NextResponse.json({ ok: true, data });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { ok: false, error: "invalid_body" },
      { status: 400 },
    );
  }

  try {
    const current = await readSiteData();
    const incoming = body as Partial<SiteData>;
    const saved = await saveSiteData({
      ...current,
      ...incoming,
      // Media is managed by /api/admin/upload and /api/admin/media only.
      media: current.media,
    });

    revalidatePath("/", "layout");
    revalidatePath("/en", "layout");
    revalidatePath("/admin", "layout");

    return NextResponse.json({ ok: true, data: saved });
  } catch (error) {
    console.error("[art-energy] content save failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "save_failed",
        message:
          error instanceof Error
            ? error.message
            : "تعذر حفظ التغييرات. تحقق من إعدادات قاعدة البيانات.",
      },
      { status: 500 },
    );
  }
}
