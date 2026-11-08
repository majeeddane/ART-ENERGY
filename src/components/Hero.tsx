"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "@/components/ui/Icons";
import { BrandMark } from "@/components/brand/Logo";
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
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      id="home"
      className="relative isolate min-h-[100svh] overflow-hidden bg-[var(--night-bg)] text-[#F7F2E9]"
    >
      {/* full-bleed image */}
      <Image
        src={heroImage}
        alt={dict.meta.ogAlt}
        fill
        priority
        unoptimized={/^https?:\/\//i.test(heroImage)}
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* cinematic scrims keep the copy readable on any photo */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#04181E]/35" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,24,30,0.72)_0%,rgba(4,24,30,0.28)_34%,rgba(4,24,30,0.5)_62%,rgba(4,24,30,0.94)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(4,24,30,0.92)_0%,rgba(4,24,30,0.66)_36%,rgba(4,24,30,0.16)_72%,rgba(4,24,30,0.04)_100%)] rtl:bg-[linear-gradient(to_left,rgba(4,24,30,0.92)_0%,rgba(4,24,30,0.66)_36%,rgba(4,24,30,0.16)_72%,rgba(4,24,30,0.04)_100%)]" />
      </div>

      <div className="container relative z-10 flex min-h-[100svh] flex-col justify-end pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-20">
        <div className="max-w-[44rem]">
          {/* brand lockup over the image */}
          <motion.div
            className="inline-flex items-center gap-3 sm:gap-4"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease }}
          >
            <BrandMark
              idPrefix="ae-hero"
              className="h-10 w-10 shrink-0 sm:h-12 sm:w-12"
            />
            <span className="flex min-w-0 flex-col justify-center">
              <span
                className="whitespace-nowrap font-grotesk text-[1.02rem] font-semibold uppercase leading-none tracking-[0.14em] text-[#F7F2E9] sm:text-[1.22rem] sm:tracking-[0.18em]"
                dir="ltr"
              >
                ART ENERGY
              </span>
              <span className="mt-1.5 flex items-center gap-2" dir="ltr">
                <span className="h-px w-4 shrink-0 bg-[#F2E04E]/60" aria-hidden />
                <span className="whitespace-nowrap font-grotesk text-[7.5px] uppercase leading-none tracking-[0.22em] text-[#F2E04E]/90 sm:text-[8.5px] sm:tracking-[0.26em]">
                  Creative media agency
                </span>
              </span>
            </span>
          </motion.div>

          {/* headline */}
          <h1 className="hero-title mt-6 font-display text-[#F7F2E9] sm:mt-7">
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.04em]">
                <motion.span
                  className={cn(
                    "block",
                    i === 2 && "text-[#F0D48A]",
                  )}
                  initial={reduced ? false : { y: "110%" }}
                  animate={ready ? { y: "0%" } : {}}
                  transition={{
                    duration: 1.05,
                    delay: 0.16 + i * 0.07,
                    ease,
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            className="mt-6 max-w-xl sm:mt-7"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.42, ease }}
          >
            <p className="text-base font-medium leading-8 text-[#F7F2E9]/85 sm:text-lg">
              {dict.hero.subtitle}
            </p>
            <p className="mt-2.5 text-[0.9rem] leading-7 text-[#F7F2E9]/60 sm:text-[0.95rem]">
              {dict.hero.body}
            </p>
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.52, ease }}
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
              className="btn border border-white/35 bg-white/5 text-[#F7F2E9] backdrop-blur-sm transition hover:border-white/60 hover:bg-white/12"
            >
              {dict.hero.ctaSecondary}
            </button>
          </motion.div>
        </div>
      </div>

      {/* scroll cue, kept away from the copy */}
      <motion.button
        type="button"
        onClick={() => scrollToSection("about")}
        className="absolute bottom-10 end-8 z-20 hidden flex-col items-center gap-3 text-[#F7F2E9]/55 transition hover:text-[#F7F2E9] lg:flex"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.1, duration: 0.8 }}
      >
        <span className="font-grotesk text-[8.5px] uppercase tracking-[0.32em]" dir="ltr">
          Scroll
        </span>
        <span className="relative h-14 w-px overflow-hidden bg-white/25">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-[#F2E04E]/80"
            animate={{ y: [-16, 56] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        <ArrowDown size={13} />
        <span className="sr-only">{dict.ui.scroll}</span>
      </motion.button>
    </section>
  );
}
