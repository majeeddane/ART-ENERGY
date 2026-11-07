"use client";

import Link from "next/link";
import { Wordmark } from "@/components/brand/Logo";
import {
  ArrowUp,
  ArrowUpRight,
  ChartColumn,
  Mail,
  Megaphone,
  Palette,
  Phone,
  Lock,
  WhatsApp,
} from "@/components/ui/Icons";
import { scrollToSection } from "@/lib/utils";
import {
  useDict,
  useFlags,
  useSettings,
} from "@/components/providers/SiteDataProvider";
import type { Locale } from "@content/model";

export function Footer({ locale }: { locale: Locale }) {
  const dict = useDict(locale);
  const settings = useSettings();
  const flags = useFlags();
  const year = new Date().getFullYear();
  const links = [
    { id: "about", label: dict.nav.about },
    { id: "services", label: dict.nav.services },
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

  const socials = [
    ["instagram", "Instagram"],
    ["x", "X"],
    ["linkedin", "LinkedIn"],
    ["tiktok", "TikTok"],
    ["youtube", "YouTube"],
    ["behance", "Behance"],
    ["facebook", "Facebook"],
  ].filter(([key]) => Boolean(settings.social[key as keyof typeof settings.social]));

  const toTop = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="on-dark relative overflow-hidden bg-[var(--night-bg)] pb-6 pt-20 text-[#F7F2E9]">
      <div className="pointer-events-none absolute -start-24 top-0 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_1fr]">
          <div>
            <Wordmark
              tone="light"
              markClassName="h-16 w-16"
              logoClassName="h-16 w-auto max-w-[15rem]"
              logoSrc={settings.logoUrl}
              idPrefix="ae-footer"
            />
            <p className="mt-6 max-w-xs text-sm leading-7 text-white/45">
              {locale === "ar"
                ? "وكالة دعاية وإعلام تبني العلامات التجارية من الفكرة إلى الأثر."
                : "An advertising and media agency building brands from idea to impact."}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[#F2E04E]">
                <Megaphone size={13} />
                <Palette size={13} />
                <ChartColumn size={13} />
              </span>
              <span className="font-grotesk text-[8px] uppercase tracking-[0.24em] text-white/55" dir="ltr">
                STRATEGY / CREATIVE / IMPACT
              </span>
            </div>

            <button
              type="button"
              onClick={toTop}
              className="group mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 py-2 pe-5 ps-2 text-xs text-white/60 transition hover:border-[#D1A246] hover:text-[#F2E04E]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2E04E] text-[#0B2730] transition group-hover:-translate-y-0.5">
                <ArrowUp size={16} />
              </span>
              {dict.footer.backTop}
            </button>
          </div>

          <nav aria-label={dict.footer.navTitle}>
            <h3 className="eyebrow text-[9px] text-[#F2E04E]/70">
              {dict.footer.navTitle}
            </h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
              {links.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.id)}
                    className="link-line text-xs text-white/50 transition hover:text-white"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="eyebrow text-[9px] text-[#F2E04E]/70">
              {dict.footer.contactTitle}
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={settings.phoneHref}
                  className="group inline-flex items-center gap-3 text-white/60 transition hover:text-white"
                >
                  <Phone size={14} className="text-[#3DC1C5]" />
                  <span dir="ltr" className="font-grotesk">
                    {settings.phoneDisplay}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 text-white/60 transition hover:text-white"
                >
                  <WhatsApp size={14} className="text-[#F28C28]" />
                  {dict.ui.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="group inline-flex items-center gap-3 text-white/60 transition hover:text-white"
                >
                  <Mail size={14} className="text-[#D1A246]" />
                  <span dir="ltr" className="font-grotesk break-all">
                    {settings.email}
                  </span>
                </a>
              </li>
            </ul>

            {socials.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {socials.map(([key, label]) => (
                  <li key={key}>
                    <a
                      href={settings.social[key as keyof typeof settings.social]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-medium text-white/60 transition hover:border-gold hover:text-[#F2E04E]"
                      dir="ltr"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-7 flex items-center gap-2">
              <Link
                href={locale === "ar" ? "/en" : "/"}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-[10px] font-semibold text-white/60 transition hover:border-gold hover:text-[#F2E04E]"
              >
                {dict.ui.language}
                <ArrowUpRight size={12} className="rtl:-scale-x-100" />
              </Link>
            </div>
          </div>
        </div>

        <div className="relative mt-16 flex flex-col gap-3 border-t border-white/10 py-6 text-[10px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} ART ENERGY — {dict.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-grotesk tracking-[0.16em]" dir="ltr">
              {dict.footer.tagline}
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-[9px] font-semibold tracking-[0.08em] text-white/50 transition hover:border-[#D1A246] hover:text-[#F2E04E]"
            >
              <Lock size={11} />
              {dict.footer.admin}
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mt-2 select-none overflow-hidden">
        <div aria-hidden className="footer-wordmark" />
        <div className="relative h-px w-full bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
      </div>
    </footer>
  );
}
