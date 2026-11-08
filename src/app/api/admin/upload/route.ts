import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import type { MediaItem } from "@content/model";
import { isAuthenticated } from "@/lib/auth-server";
import { readSiteData, saveSiteData, uploadsKind } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BYTES = 4 * 1024 * 1024; // Vercel serverless request limit is 4.5 MB.

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

function slugify(name: string) {
  return name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_form" },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "missing_file", message: "لم يتم اختيار ملف." },
      { status: 400 },
    );
  }

  const extension = EXTENSIONS[file.type];
  if (!extension) {
    return NextResponse.json(
      {
        ok: false,
        error: "invalid_type",
        message: "الصيغ المسموحة: JPG, PNG, WebP, AVIF, GIF.",
      },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      {
        ok: false,
        error: "too_large",
        message: "حجم الصورة أكبر من 4 ميجابايت. اضغطها ثم أعد المحاولة.",
      },
      { status: 413 },
    );
  }

  const key = `${Date.now()}-${slugify(file.name) || "image"}-${randomUUID().slice(0, 6)}.${extension}`;
  const provider = uploadsKind();
  let url = "";

  try {
    if (provider === "blob") {
      const { put } = await import("@vercel/blob");
      const blob = await put(`art-energy/${key}`, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: file.type,
        addRandomSuffix: false,
      });
      url = blob.url;
    } else if (provider === "cloudinary") {
      const cloud = process.env.CLOUDINARY_CLOUD_NAME!;
      const preset = process.env.CLOUDINARY_UPLOAD_PRESET!;
      const cloudForm = new FormData();
      cloudForm.append("file", file);
      cloudForm.append("upload_preset", preset);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
        { method: "POST", body: cloudForm },
      );
      const result = (await response.json()) as {
        secure_url?: string;
        error?: { message?: string };
      };
      if (!response.ok || !result.secure_url) {
        throw new Error(result.error?.message || "Cloudinary upload failed");
      }
      url = result.secure_url;
    } else {
      const directory = path.join(process.cwd(), "public", "uploads");
      await mkdir(directory, { recursive: true });
      await writeFile(
        path.join(directory, key),
        Buffer.from(await file.arrayBuffer()),
      );
      url = `/uploads/${key}`;
    }

    const item: MediaItem = {
      id: randomUUID(),
      url,
      name: file.name || key,
      type: file.type,
      size: file.size,
      createdAt: new Date().toISOString(),
      provider,
    };

    const data = await readSiteData();
    data.media = [item, ...data.media.filter((entry) => entry.url !== url)];
    const saved = await saveSiteData(data);

    return NextResponse.json({ ok: true, item, data: saved });
  } catch (error) {
    console.error("[art-energy] upload failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "upload_failed",
        message:
          error instanceof Error
            ? error.message
            : "تعذر رفع الملف. تحقق من إعدادات التخزين.",
      },
      { status: 500 },
    );
  }
}
