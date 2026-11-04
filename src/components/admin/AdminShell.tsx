"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/brand/Logo";
import {
  ArrowUpRight,
  Close,
  Globe,
  Menu,
  Note,
  Sparkle,
} from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/admin-client";

const items = [
  { href: "/admin", label: "نظرة عامة", icon: "01" },
  { href: "/admin/content", label: "محتوى الموقع", icon: "02" },
  { href: "/admin/sections", label: "الأقسام المخفية", icon: "03" },
  { href: "/admin/settings", label: "الإعدادات والهوية", icon: "04" },
  { href: "/admin/media", label: "الصور والملفات", icon: "05" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  const signOut = async () => {
    setLeaving(true);
    try {
      await logout();
    } catch {
      /* ignore */
    }
    router.replace("/admin/login");
    router.refresh();
  };

  const nav = (
    <nav className="space-y-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={cn(
            "group flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-sm transition",
            isActive(item.href)
              ? "bg-[#F2E04E] text-[#0B2730]"
              : "text-white/60 hover:bg-white/[0.06] hover:text-white",
          )}
        >
          <span className="flex items-center gap-2.5">
            <span
              className={cn(
                "font-grotesk text-[9px] tracking-[0.16em]",
                isActive(item.href) ? "text-[#0B2730]/55" : "text-white/25",
              )}
            >
              {item.icon}
            </span>
            {item.label}
          </span>
          {isActive(item.href) && <Note size={13} />}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden min-h-screen flex-col justify-between overflow-hidden bg-[#07262F] px-4 py-5 text-[#F7F2E9] lg:flex">
        <div>
          <Link href="/admin" className="flex items-center gap-3 px-2">
            <BrandMark idPrefix="ae-admin" className="h-12 w-12" />
            <span className="flex flex-col">
              <span
                className="font-grotesk text-sm font-semibold tracking-[0.18em]"
                dir="ltr"
              >
                ART ENERGY
              </span>
              <span className="mt-1 text-[10px] text-white/45">
                لوحة التحكم
              </span>
            </span>
          </Link>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
            <div className="flex items-center gap-2 text-[10px] text-[#F2E04E]/80">
              <Sparkle size={12} />
              CONTROL ROOM
            </div>
            <p className="mt-2 text-[10px] leading-5 text-white/40">
              كل تعديل تحفظه يظهر على الموقع مباشرة بعد إعادة التحقق.
            </p>
          </div>

          <div className="mt-6">{nav}</div>
        </div>

        <div className="space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between gap-2 rounded-xl border border-white/10 px-3.5 py-3 text-xs text-white/55 transition hover:border-[#D1A246] hover:text-[#F2E04E]"
          >
            <span className="flex items-center gap-2">
              <Globe size={14} />
              عرض الموقع
            </span>
            <ArrowUpRight size={13} />
          </Link>
          <button
            type="button"
            onClick={signOut}
            disabled={leaving}
            className="w-full rounded-xl border border-white/10 px-3.5 py-3 text-start text-xs text-white/45 transition hover:border-[#E7B9B5]/50 hover:text-[#F7C9C4] disabled:opacity-50"
          >
            {leaving ? "جارٍ الخروج…" : "تسجيل الخروج"}
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-[#DED5C4] bg-[#F4F0E7]/90 px-4 py-3 backdrop-blur-lg lg:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <BrandMark idPrefix="ae-admin-mobile" className="h-9 w-9" />
            <span
              className="font-grotesk text-xs font-semibold tracking-[0.16em] text-[#0B2730]"
              dir="ltr"
            >
              ART ENERGY
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="فتح القائمة"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DED5C4] bg-white text-[#0B2730]"
          >
            <Menu size={18} />
          </button>
        </header>

        {open && (
          <div className="fixed inset-0 z-[80] bg-[#07262F] p-5 text-[#F7F2E9] lg:hidden">
            <div className="flex items-center justify-between">
              <span
                className="font-grotesk text-sm font-semibold tracking-[0.18em]"
                dir="ltr"
              >
                ART ENERGY / ADMIN
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="إغلاق القائمة"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20"
              >
                <Close size={18} />
              </button>
            </div>
            <div className="mt-8">{nav}</div>
            <Link
              href="/"
              target="_blank"
              className="mt-6 flex items-center justify-between rounded-xl border border-white/10 px-3.5 py-3 text-xs text-white/60"
            >
              عرض الموقع
              <ArrowUpRight size={13} />
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="mt-2 w-full rounded-xl border border-white/10 px-3.5 py-3 text-start text-xs text-white/45"
            >
              تسجيل الخروج
            </button>
          </div>
        )}

        <main className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
