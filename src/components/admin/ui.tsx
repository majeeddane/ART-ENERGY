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
    <div className="admin-page-head">
      <div className="min-w-0">
        {eyebrow && <p className="admin-eyebrow">{eyebrow}</p>}
        <h1 className="admin-page-title">{title}</h1>
        {description && <p className="admin-page-desc">{description}</p>}
      </div>
      {children && <div className="admin-page-actions">{children}</div>}
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
  const hasHead = Boolean(title || description || actions);
  return (
    <section className={cn("admin-card", className)}>
      {hasHead && (
        <div className="admin-card-head">
          <div className="min-w-0">
            {title && <h2 className="admin-card-title">{title}</h2>}
            {description && <p className="admin-card-desc">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      {hasHead ? <div className="admin-card-body">{children}</div> : children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "ink",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  tone?: "ink" | "teal" | "gold" | "green" | "orange" | "red";
}) {
  return (
    <div className={cn("admin-stat", `tone-${tone}`)}>
      <div className="min-w-0">
        <p className="admin-stat-label">{label}</p>
        <p className="admin-stat-value">{value}</p>
        {hint && <p className="admin-stat-hint">{hint}</p>}
      </div>
      {icon && <span className="admin-stat-icon">{icon}</span>}
    </div>
  );
}

export function Notice({
  tone = "info",
  children,
}: {
  tone?: "info" | "warn" | "danger" | "success";
  children: ReactNode;
}) {
  return <div className={cn("admin-notice", `admin-notice-${tone}`)}>{children}</div>;
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
    <label className="admin-toggle">
      <span className="admin-toggle-text">
        <span className="admin-toggle-title">{label}</span>
        {description && <span className="admin-toggle-desc">{description}</span>}
      </span>
      <span className="admin-switch">
        <input
          type="checkbox"
          role="switch"
          aria-checked={checked}
          checked={checked}
          onChange={() => onChange(!checked)}
        />
        <span className="admin-switch-track" aria-hidden>
          <span className="admin-switch-thumb" />
        </span>
      </span>
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
    <div className="admin-savebar">
      <div className="admin-savebar-status min-w-0 flex-1">
        <span
          className={cn(
            "admin-savebar-dot",
            dirty ? "is-dirty" : "is-clean",
          )}
        />
        <span className="truncate">
          {saving
            ? "جارٍ الحفظ…"
            : dirty
              ? "لديك تغييرات غير محفوظة"
              : "كل التغييرات محفوظة"}
        </span>
        {message && (
          <span
            className={cn(
              "admin-savebar-message",
              message.type === "ok" ? "is-ok" : "is-error",
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
        className="admin-btn admin-btn-sm border border-white/15 bg-transparent text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white"
      >
        <Refresh size={13} />
        تراجع
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={!dirty || saving}
        className="admin-btn admin-btn-gold admin-btn-sm px-4"
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
        <div className="admin-image-preview">
          {value ? (
            <img
              src={value}
              alt={label}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full flex-col items-center justify-center gap-1.5 text-[10px] text-[#94a3a5]">
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
              className="admin-btn admin-btn-ghost admin-btn-sm"
            >
              <Upload size={13} />
              {busy ? "جارٍ الرفع…" : "رفع صورة"}
            </button>
            <button
              type="button"
              onClick={openLibrary}
              className="admin-btn admin-btn-ghost admin-btn-sm"
            >
              <ImageIcon size={13} />
              المكتبة
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="admin-btn admin-btn-sm border border-transparent bg-transparent text-[#a63a31] hover:border-[#f0cdc8] hover:bg-[#fdf1ef]"
              >
                <Close size={13} />
                إزالة
              </button>
            )}
          </div>
          {hint && <p className="admin-field-hint">{hint}</p>}
          {error && (
            <p className="text-[10px] leading-5 text-[#a63a31]">{error}</p>
          )}
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
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="admin-modal-head">
              <h3 className="admin-modal-title">مكتبة الصور</h3>
              <button
                type="button"
                onClick={() => setLibraryOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d5cdba] text-[#6c8085] transition hover:border-[#0f97a4] hover:text-[#071e25]"
                aria-label="إغلاق"
              >
                <Close size={15} />
              </button>
            </div>
            <div className="admin-modal-body admin-scroll">
              {!library ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="admin-skeleton aspect-[4/3]" />
                  ))}
                </div>
              ) : library.length === 0 ? (
                <div className="admin-empty">
                  <span className="admin-empty-icon">
                    <ImageIcon size={22} />
                  </span>
                  <p className="text-xs font-semibold text-[#102a31]">
                    لا توجد صور مرفوعة بعد
                  </p>
                  <p className="max-w-xs text-[11px] leading-6 text-[#6c8085]">
                    استخدم زر «رفع صورة» لإضافة أول صورة إلى المكتبة.
                  </p>
                </div>
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
                        "group overflow-hidden rounded-xl border bg-[#faf8f2] text-start transition",
                        value === item.url
                          ? "border-[#0f97a4] ring-2 ring-[#0f97a4]/20"
                          : "border-[#e5dfd1] hover:border-[#0f97a4]",
                      )}
                    >
                      <span className="block aspect-[4/3] overflow-hidden">
                        <img
                          src={item.url}
                          alt={item.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                        />
                      </span>
                      <span className="block truncate px-2 py-1.5 text-[9px] text-[#6c8085]">
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
  className,
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("admin-btn admin-btn-ghost admin-btn-sm", className)}
    >
      <Plus size={13} />
      {label}
    </button>
  );
}

export function DeleteButton({
  onClick,
  label = "حذف",
  className,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn("admin-icon-danger", className)}
    >
      <Trash size={12} />
    </button>
  );
}

export function CheckPill({ children }: { children: ReactNode }) {
  return (
    <span className="admin-badge admin-badge-success">
      <Check size={11} />
      {children}
    </span>
  );
}
