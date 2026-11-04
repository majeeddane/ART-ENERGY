import { unlink } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { readSiteData, saveSiteData } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 },
    );
  }
  const data = await readSiteData();
  return NextResponse.json({ ok: true, media: data.media });
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  const url = new URL(request.url).searchParams.get("url");
  const force = new URL(request.url).searchParams.get("force") === "1";
  if (!url) {
    return NextResponse.json(
      { ok: false, error: "missing_url" },
      { status: 400 },
    );
  }

  const data = await readSiteData();
  const entry = data.media.find((item) => item.url === url);
  if (!entry) {
    return NextResponse.json(
      { ok: false, error: "not_found" },
      { status: 404 },
    );
  }

  const withoutMedia = { ...data, media: [] };
  const inUse = JSON.stringify(withoutMedia).includes(url);
  if (inUse && !force) {
    return NextResponse.json(
      {
        ok: false,
        error: "in_use",
        inUse: true,
        message:
          "هذه الصورة مستخدمة حاليًا في المحتوى. احذفها من الحقول أولًا أو أكّد الحذف القسري.",
      },
      { status: 409 },
    );
  }

  data.media = data.media.filter((item) => item.url !== url);
  await saveSiteData(data);

  try {
    if (entry.provider === "blob") {
      const { del } = await import("@vercel/blob");
      await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
    } else if (entry.provider === "local" && url.startsWith("/uploads/")) {
      const filename = path.basename(url);
      await unlink(path.join(process.cwd(), "public", "uploads", filename));
    }
  } catch (error) {
    console.warn("[art-energy] media cleanup failed:", error);
  }

  return NextResponse.json({ ok: true, data });
}
