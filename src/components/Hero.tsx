"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "@/components/ui/Icons";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { cn, scrollToSection } from "@/lib/utils";
import { useDict, useSettings } from "@/components/providers/SiteDataProvider";
import type { Locale } from "@content/model";

export function Hero({ locale }: { locale: Locale }) {
  const dict = useDict(locale);
  const settings = useSettings();
  const heroImage = settings.heroImage || "/images/media-art.webp";
  const reduced = useReducedMotionSafe();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Compose the hero behind the preloader so the curtain reveals a finished scene.
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const lines = [dict.hero.titleA, dict.hero.titleB, dict.hero.titleC];
  const eyebrowParts = dict.hero.eyebrow
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-canvas text-foreground"
    >
      {/* calm studio backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_-10%,var(--teal-soft)_0%,transparent_58%)] opacity-80" />
        <div className="absolute -start-40 bottom-[-12rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,var(--gold-soft),transparent_65%)] opacity-40 blur-3xl" />
      </div>

      <div className="container relative z-10 flex min-h-[100svh] flex-col justify-center pb-14 pt-28 sm:pt-32 lg:pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* copy */}
          <div className="max-w-xl">
            <motion.div
              className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[9px] uppercase tracking-[0.18em] text-muted sm:text-[10px] sm:tracking-[0.22em]"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {eyebrowParts.map((part, i) => (
                <span key={part} className="flex items-center gap-x-3">
                  {i > 0 && (
                    <span className="h-1 w-1 rounded-full bg-gold/70" />
                  )}
                  <span
                    className={
                      i === 0 ? "text-[color:var(--accent-teal)]" : undefined
                    }
                  >
                    {part}
                  </span>
                </span>
              ))}
            </motion.div>

            <h1 className="hero-title mt-5 font-display">
              {lines.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.04em]">
                  <motion.span
                    className={cn(
                      "block",
                      i === 2 && "text-[color:var(--accent-gold)]",
                    )}
                    initial={reduced ? false : { y: "110%" }}
                    animate={ready ? { y: "0%" } : {}}
                    transition={{
                      duration: 1.05,
                      delay: 0.05 + i * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.div
              className="mt-6 max-w-lg"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-base font-semibold text-[color:var(--accent-teal)] sm:text-lg">
                {dict.hero.subtitle}
              </p>
              <p className="mt-3 text-sm leading-8 text-muted sm:text-[0.95rem]">
                {dict.hero.body}
              </p>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap items-center gap-3"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="btn btn-primary"
              >
                {dict.hero.ctaPrimary}
                <ArrowUpRight className="rtl:-scale-x-100" size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("services")}
                className="btn btn-outline"
              >
                {dict.hero.ctaSecondary}
              </button>
            </motion.div>
          </div>

          {/* visual */}
          <motion.div
            className="relative mx-auto w-full max-w-[480px] lg:max-w-[520px]"
            initial={reduced ? false : { opacity: 0, y: 26 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[112%] -translate-x-1/2 -translate-y-1/2"
            >
              <span className="absolute inset-0 rounded-full border border-line" />
              <span className="absolute inset-[7%] rounded-full border border-dashed border-line/80" />
              <span className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,var(--teal-soft),transparent_68%)] opacity-70 blur-2xl" />
            </div>

            <div className="relative overflow-hidden rounded-[1.9rem] border border-line bg-surface p-2 shadow-[0_50px_120px_-60px_rgba(11,39,48,0.55)]">
              <div className="relative aspect-[5/6] overflow-hidden rounded-[1.45rem] bg-surface">
                <Image
                  src={heroImage}
                  alt={dict.meta.ogAlt}
                  fill
                  priority
                  unoptimized={/^https?:\/\//i.test(heroImage)}
                  sizes="(max-width: 1024px) 90vw, 520px"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent_30%,rgba(4,24,30,0.08))]" />
              </div>
            </div>

            <div
              className="mt-4 flex items-center justify-between gap-4 text-[8.5px] uppercase tracking-[0.2em] text-muted"
              dir="ltr"
            >
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-gold" />
                SHOWREEL / 01
              </span>
              <span>ART ENERGY</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <motion.button
        type="button"
        onClick={() => scrollToSection("about")}
        className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-muted transition hover:text-[color:var(--accent-teal)] sm:flex"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span className="font-grotesk" dir="ltr">
          {dict.ui.scroll}
        </span>
        <span className="sr-only">{dict.hero.ctaSecondary}</span>
        <span className="relative h-9 w-px overflow-hidden bg-[var(--line)]">
          <motion.span
            className="absolute inset-x-0 top-0 h-3 bg-[color:var(--accent-teal)]"
            animate={{ y: [-12, 36] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        <ArrowDown size={13} />
      </motion.button>
    </section>
  );
}
