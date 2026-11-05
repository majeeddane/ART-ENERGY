"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Wordmark } from "@/components/brand/Logo";
import {
  ArrowUpRight,
  Close,
  Globe,
  Megaphone,
  Menu,
  Moon,
  Phone,
  Sun,
  WhatsApp,
} from "@/components/ui/Icons";
import { Magnetic } from "@/components/ui/Magnetic";
import { useSound } from "@/components/providers/SoundProvider";
import { useLockScroll, useScrolled, useTheme } from "@/hooks/useUi";
import { cn, scrollToSection } from "@/lib/utils";
import {
  useDict,
  useFlags,
  useSettings,
} from "@/components/providers/SiteDataProvider";
import type { Locale } from "@content/model";

export function Navbar({ locale }: { locale: Locale }) {
  const dict = useDict(locale);
  const settings = useSettings();
  const flags = useFlags();
  const scrolled = useScrolled(36);
  const { play } = useSound();
  const { theme, toggle: toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useLockScroll(open);

  const closeMenu = (restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) {
      window.setTimeout(() => triggerRef.current?.focus(), 0);
    }
  };

  useEffect(() => {
    if (!open) return;
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 120);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        return;
      }
      if (e.key !== "Tab") return;

      const root = dialogRef.current;
      if (!root) return;
      const items = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !root.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !root.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    window.setTimeout(() => scrollToSection(id), 80);
  };

  const links: Array<{ id: string; label: string }> = [
    { id: "about", label: dict.nav.about },
    { id: "services", label: dict.nav.services },
    { id: "packages", label: dict.nav.packages },
    { id: "production", label: dict.nav.production },
    { id: "campaigns", label: dict.nav.campaigns },
    { id: "contact", label: dict.nav.contact },
  ];

  const mobileLinks: Array<{ id: string; label: string }> = [
    { id: "about", label: dict.nav.about },
    { id: "services", label: dict.nav.services },
    { id: "journey", label: dict.nav.journey },
    { id: "packages", label: dict.nav.packages },
    { id: "production", label: dict.nav.production },
    { id: "campaigns", label: dict.nav.campaigns },
    { id: "why", label: dict.nav.why },
    ...(flags.work ? [{ id: "work", label: dict.hidden.work.label }] : []),
    ...(flags.clients
      ? [{ id: "clients", label: dict.hidden.clients.label }]
      : []),
    ...(flags.team ? [{ id: "team", label: dict.hidden.team.label }] : []),
    ...(flags.journal
      ? [{ id: "journal", label: dict.hidden.journal.label }]
      : []),
    { id: "contact", label: dict.nav.contact },
  ];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100]">
        <div className="container">
          <div
            className={cn(
              "mt-3 flex h-[4.25rem] items-center justify-between gap-4 rounded-full border border-line px-3 text-foreground backdrop-blur-xl transition-all duration-500 sm:px-4",
              "bg-[var(--nav-bg)]",
              scrolled
                ? "shadow-[0_18px_50px_-28px_rgba(4,24,30,0.45)]"
                : "shadow-none",
            )}
          >
            <Link
              href={locale === "ar" ? "/" : "/en"}
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="shrink-0 rounded-full focus-visible:outline-offset-4"
            >
              <Wordmark
                tone="auto"
                markClassName="h-10 w-10"
                compact={false}
                logoSrc={settings.logoUrl}
                idPrefix="ae-nav"
                className="[&>span:last-child>span:last-child]:hidden sm:[&>span:last-child>span:last-child]:block"
              />
            </Link>

            <nav className="hidden items-center gap-6 lg:flex" aria-label={dict.ui.menu}>
              {links.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => go(link.id)}
                  onMouseEnter={() => play("hover")}
                  className="link-line text-[0.82rem] font-medium text-foreground/75 transition hover:text-[color:var(--accent-teal)]"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href={locale === "ar" ? "/en" : "/"}
                className={cn(
                  "hidden h-9 items-center gap-1.5 rounded-full border border-line px-3 text-[0.72rem] font-semibold transition hover:border-gold sm:inline-flex",
                )}
              >
                <Globe size={14} aria-hidden />
                <span dir="ltr">{locale === "ar" ? "EN" : "ع"}</span>
                <span className="sr-only">{dict.ui.languageLabel}</span>
              </Link>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? dict.ui.themeLight : dict.ui.themeDark}
                className={cn(
                  "hidden h-9 w-9 items-center justify-center rounded-full border border-line transition hover:border-gold sm:inline-flex",
                )}
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              <button
                type="button"
                onClick={() => go("contact")}
                onMouseEnter={() => play("hover")}
                className="hidden h-10 items-center gap-1.5 rounded-full border border-line px-3.5 text-[0.72rem] font-semibold transition hover:border-gold sm:inline-flex lg:hidden"
              >
                <Phone size={14} aria-hidden />
                <span className="sr-only">{dict.ui.phone}</span>
              </button>

              <Magnetic strength={0.14} className="hidden md:inline-block">
                <button
                  type="button"
                  onClick={() => go("contact")}
                  onMouseEnter={() => play("hover")}
                  className="btn btn-primary h-10 min-h-0 px-4 text-[0.8rem]"
                >
                  {dict.hero.ctaPrimary}
                  <ArrowUpRight size={15} className="rtl:-scale-x-100" />
                </button>
              </Magnetic>

              <button
                ref={triggerRef}
                type="button"
                onClick={() => {
                  setOpen(true);
                  play("open");
                }}
                aria-label={open ? dict.ui.closeMenu : dict.ui.openMenu}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-haspopup="dialog"
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-line transition hover:border-gold lg:hidden",
                )}
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={dialogRef}
            id="mobile-menu"
            className="fixed inset-0 z-[130] overflow-y-auto bg-[var(--night-2)] text-[#F7F2E9] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            role="dialog"
            aria-modal="true"
            aria-label={dict.ui.menu}
          >
            <div className="grain min-h-full overflow-hidden px-6 pb-10 pt-5">
              <div className="relative z-10 flex items-center justify-between">
                <Wordmark
                  tone="light"
                  markClassName="h-10 w-10"
                  logoSrc={settings.logoUrl}
                  idPrefix="ae-menu"
                />
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => closeMenu()}
                  aria-label={dict.ui.closeMenu}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20"
                >
                  <Close size={20} />
                </button>
              </div>

              <div className="relative z-10 mt-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-[#F2E04E]/80">
                <Megaphone size={14} className="text-[#F2E04E]" />
                <span dir="ltr">ART ENERGY / INDEX</span>
              </div>

              <nav className="relative z-10 mt-5 flex flex-col" aria-label={dict.ui.menu}>
                {mobileLinks.map((link, i) => (
                  <motion.button
                    key={link.id}
                    type="button"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.045, duration: 0.55 }}
                    onClick={() => go(link.id)}
                    className="group flex items-baseline justify-between border-b border-white/10 py-3.5 text-start"
                  >
                    <span className="menu-link font-display">{link.label}</span>
                    <span className="font-grotesk text-[10px] tracking-[0.2em] text-gold/70">
                      0{i + 1}
                    </span>
                  </motion.button>
                ))}
              </nav>

              <div className="relative z-10 mt-10 grid grid-cols-2 gap-3">
                <Link
                  href={locale === "ar" ? "/en" : "/"}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-4 text-sm font-semibold"
                >
                  <Globe size={16} aria-hidden />
                  {dict.ui.language}
                  <span className="sr-only">{dict.ui.languageLabel}</span>
                </Link>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-4 text-sm font-semibold"
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                  {theme === "dark" ? dict.ui.themeLight : dict.ui.themeDark}
                </button>
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-2 flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#F28C28] px-4 text-sm font-bold text-[#1b1206]"
                >
                  <WhatsApp size={16} />
                  {dict.ui.whatsapp}
                </a>
              </div>

              <div className="relative z-10 mt-8 space-y-2 text-sm text-[#F7F2E9]/60">
                <a href={settings.phoneHref} className="flex items-center gap-2">
                  <Phone size={14} />
                  <span dir="ltr">{settings.phoneDisplay}</span>
                </a>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2">
                  <span className="font-grotesk" dir="ltr">
                    {settings.email}
                  </span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
