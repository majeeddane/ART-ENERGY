"use client";

import { useRef, useState } from "react";
import type { MediaItem } from "@content/model";
import {
  Card,
  DeleteButton,
  Notice,
  PageHeader,
} from "@/components/admin/ui";
import { ImageIcon, Upload } from "@/components/ui/Icons";
import { deleteMedia, uploadImage } from "@/lib/admin-client";

function sizeLabel(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary({
  initialMedia,
  uploads,
}: {
  initialMedia: MediaItem[];
  uploads: "blob" | "cloudinary" | "local";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState(initialMedia);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const upload = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const result = await uploadImage(file);
      setMedia((current) => [
        result.item,
        ...current.filter((item) => item.url !== result.item.url),
      ]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "تعذر رفع الملف.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (item: MediaItem) => {
    if (!window.confirm(`حذف «${item.name}» من المكتبة؟`)) return;
    setError(null);
    try {
      const result = await deleteMedia(item.url);
      setMedia(result.data.media);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "";
      if (message.includes("مستخدمة")) {
        if (
          window.confirm(
            "هذه الصورة مستخدمة في المحتوى. حذفها سيؤدي إلى رابط مكسور. هل تريد الحذف القسري؟",
          )
        ) {
          try {
            const result = await deleteMedia(item.url, true);
            setMedia(result.data.media);
            return;
          } catch (forceError) {
            setError(
              forceError instanceof Error
                ? forceError.message
                : "تعذر حذف الملف.",
            );
            return;
          }
        }
      }
      setError(message || "تعذر حذف الملف.");
    }
  };

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setError("تعذر النسخ. انسخ الرابط يدويًا.");
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="MEDIA / الصور"
        title="الصور والملفات"
        description="ارفع صور الشعار والهيرو والأعمال والفريق والمقالات. كل الصور المرفوعة متاحة داخل حقول الصور في بقية الصفحات."
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="admin-btn admin-btn-primary min-h-10 px-4 text-[10px] font-semibold"
        >
          <Upload size={14} />
          {busy ? "جارٍ الرفع…" : "رفع صور"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          multiple
          className="hidden"
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            files.forEach((file) => upload(file));
            event.target.value = "";
          }}
        />
      </PageHeader>

      {error && (
        <div className="mb-4">
          <Notice tone="danger">{error}</Notice>
        </div>
      )}

      <Notice tone={uploads === "local" ? "warn" : "info"}>
        {uploads === "local" ? (
          <>
            التخزين الحالي محلي (<code className="font-grotesk">public/uploads</code>).
            يعمل في التطوير فقط. أضف <code className="font-grotesk">BLOB_READ_WRITE_TOKEN</code>{" "}
            (Vercel) أو إعدادات Cloudinary قبل النشر حتى تُحفظ الصور في الإنتاج.
          </>
        ) : uploads === "blob" ? (
          <>
            الصور تُرفع إلى <strong>Vercel Blob</strong> وتُخدم مباشرة من الشبكة.
          </>
        ) : (
          <>
            الصور تُرفع إلى <strong>Cloudinary</strong> وتُخدم مباشرة من الشبكة.
          </>
        )}
      </Notice>

      <div className="mt-6">
        {media.length === 0 ? (
          <Card className="p-6">
            <div className="admin-empty">
              <span className="admin-empty-icon">
                <ImageIcon size={24} />
              </span>
              <p className="text-sm font-semibold text-[#102a31]">
                لا توجد صور بعد
              </p>
              <p className="mt-1 max-w-sm text-[11px] leading-6 text-[#6c8085]">
                ارفع أول صورة لتظهر هنا وتصبح متاحة في حقول الصور.
              </p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="admin-btn admin-btn-ghost admin-btn-sm mt-4"
              >
                <Upload size={13} />
                رفع صورة
              </button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {media.map((item) => (
              <article
                key={item.id}
                className="admin-media-tile"
              >
                <div className="relative aspect-[4/3] bg-[#faf8f2]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <span className="absolute end-2 top-2 rounded-full bg-[#04181E]/70 px-2 py-1 font-grotesk text-[8px] uppercase tracking-[0.12em] text-white/80">
                    {item.provider}
                  </span>
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold text-[#14262B]">
                        {item.name}
                      </p>
                      <p className="mt-0.5 font-grotesk text-[9px] text-[#8A9797]" dir="ltr">
                        {sizeLabel(item.size)} ·{" "}
                        {new Date(item.createdAt).toLocaleDateString("ar-SA")}
                      </p>
                    </div>
                    <DeleteButton onClick={() => remove(item)} />
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5">
                    <input
                      className="admin-input min-w-0 flex-1 px-2 py-1.5 text-[9px]"
                      dir="ltr"
                      readOnly
                      value={item.url}
                      onFocus={(event) => event.target.select()}
                    />
                    <button
                      type="button"
                      onClick={() => copy(item.url)}
                      className="admin-btn admin-btn-ghost min-h-8 shrink-0 px-2.5 text-[9px]"
                    >
                      {copied === item.url ? "تم النسخ" : "نسخ"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
