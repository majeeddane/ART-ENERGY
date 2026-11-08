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
  PenTool,
  Sparkle,
  Lock,
} from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/admin-client";

const items = [
  { href: "/admin", label: "نظرة عامة", icon: "01" },
  { href: "/admin/about", label: "إدارة من نحن", icon: "02" },
  { href: "/admin/hero", label: "إدارة الصفحة الرئيسية", icon: "03" },
  { href: "/admin/content", label: "محتوى الموقع", icon: "04" },
  { href: "/admin/services", label: "إدارة الخدمات", icon: "05" },
  { href: "/admin/packages", label: "إدارة الباقات", icon: "06" },
  { href: "/admin/campaigns", label: "إدارة الحملات", icon: "07" },
  { href: "/admin/appearance", label: "إدارة المظهر", icon: "08" },
  { href: "/admin/sections", label: "الأقسام المخفية", icon: "09" },
  { href: "/admin/settings", label: "الإعدادات والهوية", icon: "10" },
  { href: "/admin/media", label: "الصور والملفات", icon: "11" },
  { href: "/admin/inquiries", label: "استفسارات التواصل", icon: "12" },
  { href: "/admin/users", label: "إدارة المستخدمين", icon: "13" },
  { href: "/admin/audit-log", label: "سجل النشاطات", icon: "14" },
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
    <nav className="space-y-0.5">
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "group relative flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-sm transition-all duration-300",
              active
                ? "bg-[#0B2730] text-[#F2E04E] shadow-[0_0_0_8px_rgba(11,39,48,0.25)]"
                : "text-[#456067] hover:bg-[#F4F0E7] hover:text-[#0B2730] hover:border-[#139CAA]/30",
              "border border-transparent",
            )}
          >
            <span className="flex items-center gap-2.5">
              <span
                className={cn(
                  "font-grotesk text-[9px] tracking-[0.16em] shrink-0",
                  active ? "text-[#F2E04E]" : "text-[#9AA5A5]",
                )}
              >
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </span>
            {active && (
              <span className="absolute -right-1 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#F2E04E]" />
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden min-h-screen flex-col justify-between overflow-hidden bg-[#0B2730] px-4 py-6 text-[#F7F2E9] lg:flex shadow-[0_10px_40px_-20px_rgba(0,0,0,0.15)]">
        <div>
          <Link
            href="/admin"
            className="flex items-center gap-3 px-2 mb-8"
          >
            <BrandMark idPrefix="ae-admin" className="h-12 w-12" />
            <span className="flex flex-col">
              <span
                className="font-grotesk text-sm font-semibold tracking-[0.18em]"
                dir="ltr"
              >
                ART ENERGY
              </span>
              <span className="mt-1 text-[10px] text-white/50">
                لوحة التحكم
              </span>
            </span>
          </Link>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-lg shadow-[#0B2730]/30">
            <div className="flex items-center gap-2 text-[10px] text-[#F2E04E]/80">
              <Sparkle size={12} />
              CONTROL ROOM
            </div>
            <p className="mt-2 text-[10px] leading-5 text-white/45">
              كل تعديل تحفظه يظهر على الموقع مباشرة بعد إعادة التحميل.
            </p>
          </div>

          <div className="mt-8">{nav}</div>
        </div>

        <div className="space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between gap-2 rounded-xl border border-white/10 px-3.5 py-3 text-xs text-white/55 transition-all duration-200 hover:border-[#D1A246] hover:text-[#F2E04E] hover:shadow-[0_0_0_5px_rgba(209,162,70,0.20)]"
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
            className="w-full rounded-xl border border-white/10 px-3.5 py-3 text-start text-xs text-white/45 transition-all duration-200 disabled:opacity-50 hover:border-[#E7B9B5]/50 hover:text-[#F7C9C4] disabled:hover:border-white/10 disabled:hover:text-white/45"
          >
            {leaving ? "جارٍ الخروج…" : "تسجيل الخروج"}
          </button>
        </div>
      </aside>

      <div className="min-w-0 admin-body">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-[#E7E0D3] bg-white/90 px-4 py-3 backdrop-blur-xl lg:hidden shadow-sm">
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DED5C4] bg-white text-[#0B2730] transition-all duration-200 hover:border-[#139CAA] hover:bg-[#139CAA]/10"
          >
            <Menu size={18} />
          </button>
        </header>

        {open && (
          <div className="fixed inset-0 z-[80] bg-[#0B2730] p-5 text-[#F7F2E9] lg:hidden backdrop-blur-md shadow-lg">
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-all duration-200 hover:border-white"
              >
                <Close size={18} />
              </button>
            </div>
            <div className="mt-8">{nav}</div>
            <Link
              href="/"
              target="_blank"
              className="mt-6 flex items-center justify-between rounded-xl border border-white/10 px-3.5 py-3 text-xs text-white/60 transition-all duration-200 hover:border-[#D1A246] hover:text-[#F2E04E]"
            >
              عرض الموقع
              <ArrowUpRight size={13} />
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="mt-2 w-full rounded-xl border border-white/10 px-3.5 py-3 text-start text-xs text-white/45 transition-all duration-200 hover:border-[#E7B9B5]/50 hover:text-[#F7C9C4]"
            >
              تسجيل الخروج
            </button>
          </div>
        )}

        <main className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
