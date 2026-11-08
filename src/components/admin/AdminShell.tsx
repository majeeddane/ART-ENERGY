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
} from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/admin-client";

type NavItem = {
  href: string;
  label: string;
  index: string;
};

const groups: Array<{ label: string; items: NavItem[] }> = [
  {
    label: "الرئيسية",
    items: [{ href: "/admin", label: "نظرة عامة", index: "01" }],
  },
  {
    label: "المحتوى",
    items: [
      { href: "/admin/about", label: "إدارة من نحن", index: "02" },
      { href: "/admin/hero", label: "إدارة الصفحة الرئيسية", index: "03" },
      { href: "/admin/content", label: "محتوى الموقع", index: "04" },
      { href: "/admin/services", label: "إدارة الخدمات", index: "05" },
      { href: "/admin/packages", label: "إدارة الباقات", index: "06" },
      { href: "/admin/campaigns", label: "إدارة الحملات", index: "07" },
      { href: "/admin/appearance", label: "إدارة المظهر", index: "08" },
    ],
  },
  {
    label: "المعرض والأقسام",
    items: [
      { href: "/admin/sections", label: "الأقسام المخفية", index: "09" },
      { href: "/admin/media", label: "الصور والملفات", index: "11" },
    ],
  },
  {
    label: "النظام",
    items: [
      { href: "/admin/settings", label: "الإعدادات والهوية", index: "10" },
      { href: "/admin/inquiries", label: "استفسارات التواصل", index: "12" },
      { href: "/admin/users", label: "إدارة المستخدمين", index: "13" },
      { href: "/admin/audit-log", label: "سجل النشاطات", index: "14" },
    ],
  },
];

const allItems = groups.flatMap((group) => group.items);

function isActivePath(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

function NavList({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div>
      {groups.map((group) => (
        <div key={group.label} className="admin-nav-group">
          <p className="admin-nav-group-label">{group.label}</p>
          <nav className="admin-nav" aria-label={group.label}>
            {group.items.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn("admin-nav-link", active && "is-active")}
                >
                  <span className="admin-nav-index">{item.index}</span>
                  <span className="admin-nav-label">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const current =
    allItems.find((item) => isActivePath(pathname, item.href)) ?? allItems[0];

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

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="القائمة الجانبية">
        <div className="admin-sidebar-top">
          <Link href="/admin" className="admin-brand">
            <BrandMark idPrefix="ae-admin" className="h-11 w-11 shrink-0" />
            <span className="admin-brand-copy">
              <span className="admin-brand-name" dir="ltr">
                ART ENERGY
              </span>
              <span className="admin-brand-sub">لوحة التحكم</span>
            </span>
          </Link>

          <div className="admin-sidebar-meta">
            <span className="admin-sidebar-meta-dot" aria-hidden />
            Control Room
          </div>
        </div>

        <div className="admin-sidebar-scroll">
          <NavList pathname={pathname} />
        </div>

        <div className="admin-sidebar-footer">
          <Link href="/" target="_blank" className="admin-sidebar-link">
            <span>
              <Globe size={14} />
              عرض الموقع
            </span>
            <ArrowUpRight size={13} />
          </Link>
          <button
            type="button"
            onClick={signOut}
            disabled={leaving}
            className="admin-sidebar-button"
          >
            {leaving ? "جارٍ الخروج…" : "تسجيل الخروج"}
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="flex min-w-0 items-center gap-2.5 lg:hidden">
            <BrandMark idPrefix="ae-admin-mobile" className="h-9 w-9 shrink-0" />
            <div className="admin-topbar-title">
              <span className="admin-topbar-kicker">Admin</span>
              <span className="admin-topbar-current">{current.label}</span>
            </div>
          </div>

          <div className="hidden min-w-0 flex-col lg:flex">
            <span className="admin-topbar-kicker">
              ART ENERGY / ADMIN PANEL
            </span>
            <span className="admin-topbar-current">{current.label}</span>
          </div>

          <div className="admin-topbar-actions">
            <Link
              href="/"
              target="_blank"
              className="admin-btn admin-btn-ghost admin-btn-sm hidden sm:inline-flex"
            >
              <Globe size={13} />
              عرض الموقع
              <ArrowUpRight size={12} />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="فتح القائمة"
              aria-expanded={open}
              className="admin-icon-button lg:hidden"
            >
              <Menu size={18} />
            </button>
          </div>
        </header>

        {open && (
          <div className="admin-drawer lg:hidden" role="dialog" aria-modal="true">
            <div className="admin-drawer-head">
              <div className="flex items-center gap-2.5">
                <BrandMark idPrefix="ae-admin-drawer" className="h-9 w-9" />
                <span className="admin-drawer-brand" dir="ltr">
                  ART ENERGY
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="إغلاق القائمة"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-[#f7f2e9] transition-colors hover:border-white/60"
              >
                <Close size={17} />
              </button>
            </div>

            <div className="admin-drawer-scroll">
              <NavList pathname={pathname} onNavigate={() => setOpen(false)} />
            </div>

            <div className="admin-sidebar-footer" style={{ padding: 0 }}>
              <Link
                href="/"
                target="_blank"
                className="admin-sidebar-link"
                onClick={() => setOpen(false)}
              >
                <span>
                  <Globe size={14} />
                  عرض الموقع
                </span>
                <ArrowUpRight size={13} />
              </Link>
              <button
                type="button"
                onClick={signOut}
                disabled={leaving}
                className="admin-sidebar-button"
              >
                {leaving ? "جارٍ الخروج…" : "تسجيل الخروج"}
              </button>
            </div>
          </div>
        )}

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
