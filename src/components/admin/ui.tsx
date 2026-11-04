"use client";

import { useRef, useState } from "react";
import type { MouseEventHandler, ReactNode } from "react";
import type { MediaItem } from "@content/model";
import {
  Check,
  Close,
  ImageIcon,
  Plus,
  Refresh,
  Save,
  Trash,
  Upload,
} from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { listMedia, uploadImage } from "@/lib/admin-client";
import type { DraftMessage } from "@/components/admin/useSiteDraft";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mb-2 font-grotesk text-[9px] tracking-[0.24em] text-[#8A6A25]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-[#0B2730] sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#6A7D80]">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function Card({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("admin-card p-4 sm:p-5", className)}>
      {(title || actions) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="admin-section-title">{title}</h2>}
            {description && <p className="admin-muted mt-1">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function Notice({
  tone = "info",
  children,
}: {
  tone?: "info" | "warn" | "danger" | "success";
  children: ReactNode;
}) {
  const tones = {
    info: "border-[#B9D8DB] bg-[#EEF8F8] text-[#28636B]",
    warn: "border-[#E7D19A] bg-[#FBF3DD] text-[#73551A]",
    danger: "border-[#E7B9B5] bg-[#FDF3F2] text-[#A9362E]",
    success: "border-[#B9DCC4] bg-[#EFF9F2] text-[#2C6B44]",
  } as const;
  return (
    <div className={cn("rounded-xl border px-3.5 py-3 text-xs leading-6", tones[tone])}>
      {children}
    </div>
  );
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-[#E7E0D3] bg-[#FCFAF5] p-3.5">
      <span>
        <span className="block text-sm font-semibold text-[#14262B]">
          {label}
        </span>
        {description && (
          <span className="mt-1 block text-[11px] leading-5 text-[#6A7D80]">
            {description}
          </span>
        )}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition",
          checked
            ? "border-[#0B2730] bg-[#0B2730]"
            : "border-[#DED5C4] bg-[#EAE4D8]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow transition",
            checked ? "start-[1.45rem]" : "start-0.5",
          )}
          style={{ height: 18, width: 18 }}
        />
      </button>
    </label>
  );
}

export function SaveBar({
  dirty,
  saving,
  message,
  onSave,
  onDiscard,
  extra,
}: {
  dirty: boolean;
  saving: boolean;
  message: DraftMessage;
  onSave: () => void;
  onDiscard: () => void;
  extra?: ReactNode;
}) {
  return (
    <div className="sticky bottom-3 z-30 mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-[#0B2730] p-3 text-[#F7F2E9] shadow-[0_20px_50px_-20px_rgba(11,39,48,0.8)]">
      <div className="flex min-w-0 flex-1 items-center gap-2 text-[11px]">
        <span
          className={cn(
            "h-2 w-2 shrink-0 rounded-full",
            dirty ? "bg-[#F2E04E]" : "bg-[#3DC1C5]",
          )}
        />
        <span className="text-white/60">
          {saving
            ? "جارٍ الحفظ…"
            : dirty
              ? "لديك تغييرات غير محفوظة"
              : "كل التغييرات محفوظة"}
        </span>
        {message && (
          <span
            className={cn(
              "truncate rounded-full px-2.5 py-1 text-[10px]",
              message.type === "ok"
                ? "bg-[#3DC1C5]/15 text-[#8AE0E1]"
                : "bg-[#E7B9B5]/15 text-[#F7C9C4]",
            )}
          >
            {message.text}
          </span>
        )}
      </div>
      {extra}
      <button
        type="button"
        onClick={onDiscard}
        disabled={!dirty || saving}
        className="admin-btn min-h-9 border border-white/15 px-3 text-[10px] text-white/60 hover:border-white/35 hover:text-white"
      >
        <Refresh size={13} />
        تراجع
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={!dirty || saving}
        className="admin-btn admin-btn-gold min-h-9 px-4 text-[10px]"
      >
        <Save size={14} />
        {saving ? "جارٍ الحفظ…" : "حفظ التغييرات"}
      </button>
    </div>
  );
}

export function ImageField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [library, setLibrary] = useState<MediaItem[] | null>(null);

  const upload = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const result = await uploadImage(file);
      onChange(result.item.url);
      setLibrary((current) =>
        current ? [result.item, ...current] : current,
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "تعذر رفع الصورة.");
    } finally {
      setBusy(false);
    }
  };

  const openLibrary = async () => {
    setLibraryOpen(true);
    if (library) return;
    try {
      const result = await listMedia();
      setLibrary(result.media);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "تعذر تحميل المكتبة.");
      setLibrary([]);
    }
  };

  return (
    <div>
      <label className="admin-label">{label}</label>
      <div className="flex flex-wrap items-start gap-3">
        <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-xl border border-[#DED5C4] bg-[#FCFAF5]">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt={label}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full flex-col items-center justify-center gap-1 text-[10px] text-[#9AA5A5]">
              <ImageIcon size={20} />
              لا توجد صورة
            </span>
          )}
        </div>

        <div className="min-w-[220px] flex-1 space-y-2">
          <input
            type="url"
            className="admin-input text-[11px]"
            dir="ltr"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://… أو /images/…"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="admin-btn admin-btn-ghost min-h-8 px-3 text-[10px]"
            >
              <Upload size={13} />
              {busy ? "جارٍ الرفع…" : "رفع صورة"}
            </button>
            <button
              type="button"
              onClick={openLibrary}
              className="admin-btn admin-btn-ghost min-h-8 px-3 text-[10px]"
            >
              <ImageIcon size={13} />
              المكتبة
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="admin-btn min-h-8 px-2.5 text-[10px] text-[#A9362E] hover:bg-[#FDF3F2]"
              >
                <Close size={13} />
                إزالة
              </button>
            )}
          </div>
          {hint && <p className="text-[10px] leading-5 text-[#8A9797]">{hint}</p>}
          {error && <p className="text-[10px] leading-5 text-[#A9362E]">{error}</p>}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) upload(file);
          event.target.value = "";
        }}
      />

      {libraryOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#04181E]/70 p-4 backdrop-blur-sm">
          <div className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-[#DED5C4] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E7E0D3] px-5 py-3.5">
              <h3 className="text-sm font-bold text-[#0B2730]">
                مكتبة الصور
              </h3>
              <button
                type="button"
                onClick={() => setLibraryOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#DED5C4] text-[#6A7D80]"
                aria-label="إغلاق"
              >
                <Close size={15} />
              </button>
            </div>
            <div className="admin-scroll max-h-[60vh] overflow-y-auto p-4">
              {!library ? (
                <p className="py-10 text-center text-xs text-[#8A9797]">
                  جارٍ التحميل…
                </p>
              ) : library.length === 0 ? (
                <p className="py-10 text-center text-xs text-[#8A9797]">
                  لا توجد صور مرفوعة بعد. استخدم زر «رفع صورة».
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {library.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onChange(item.url);
                        setLibraryOpen(false);
                      }}
                      className={cn(
                        "group overflow-hidden rounded-xl border bg-[#FCFAF5] text-start transition",
                        value === item.url
                          ? "border-[#139CAA] ring-2 ring-[#139CAA]/20"
                          : "border-[#E7E0D3] hover:border-[#139CAA]",
                      )}
                    >
                      <span className="block aspect-[4/3] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.url}
                          alt={item.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                        />
                      </span>
                      <span className="block truncate px-2 py-1.5 text-[9px] text-[#6A7D80]">
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AddButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="admin-btn admin-btn-ghost min-h-8 px-3 text-[10px]"
    >
      <Plus size={13} />
      {label}
    </button>
  );
}

export function DeleteButton({
  onClick,
  label = "حذف",
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#E7B9B5] text-[#A9362E] transition hover:bg-[#FDF3F2]"
    >
      <Trash size={12} />
    </button>
  );
}

export function CheckPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#EFF9F2] px-2.5 py-1 text-[10px] font-medium text-[#2C6B44]">
      <Check size={11} />
      {children}
    </span>
  );
}
