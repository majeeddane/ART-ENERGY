"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ThreeWaves } from "@/components/ThreeWaves";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { ArrowDown, ArrowUpRight, Note } from "@/components/ui/Icons";
import { Equalizer } from "@/components/ui/Section";
import { Magnetic } from "@/components/ui/Magnetic";
import { useSound } from "@/components/providers/SoundProvider";
import { cn, scrollToSection } from "@/lib/utils";
import { useDict, useSettings } from "@/components/providers/SiteDataProvider";
import type { Locale } from "@content/model";

export function Hero({ locale }: { locale: Locale }) {
  const dict = useDict(locale);
  const settings = useSettings();
  const heroImage = settings.heroImage || "/images/wave-art.webp";
  const reduced = useReducedMotionSafe();
  const [ready, setReady] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 120, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 120, damping: 18 });
  const glareX = useTransform(rotateY, [-6, 6], ["30%", "70%"]);

  useEffect(() => {
    // Animate the hero behind the preloader so it is already composed when
    // the curtain lifts. This also keeps the LCP element immediately visible.
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const onCardMove = (e: React.PointerEvent) => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 9);
    rx.set(-py * 9);
  };

  const resetCard = () => {
    rx.set(0);
    ry.set(0);
  };

  const lines = [dict.hero.titleA, dict.hero.titleB, dict.hero.titleC];

  return (
    <section
      id="home"
      className="on-dark relative isolate min-h-[100svh] overflow-hidden bg-[var(--night-bg)] text-[var(--night-fg)]"
    >
      {/* background — layered studio night */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_72%_12%,var(--night-3)_0%,var(--night-2)_38%,var(--night-bg)_74%)]" />
      <div className="absolute inset-0 opacity-[0.5]">
        <ThreeWaves className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute -start-40 top-1/4 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,var(--night-glow),transparent_66%)]" />
      <div className="pointer-events-none absolute -end-36 -top-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,var(--night-glow-2),transparent_66%)]" />
      {/* ground glow + bottom vignette to melt into the next band */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/55 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 60% at 50% 110%, rgba(19,156,170,0.10), transparent 70%)",
        }}
      />

      {/* circuit lines */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <g fill="none" stroke="#8AD9DD" strokeWidth="1">
          <path d="M1180 80h120v60h90v90" />
          <path d="M1240 230h80v90h90" />
          <path d="M1100 160h60v80h-40v90" />
          <path d="M120 720h110v-70h90" />
          <path d="M60 620h80v-80h110" />
          <path d="M180 820h90v-50h80" />
        </g>
        <g fill="#D1A246">
          <circle cx="1390" cy="230" r="3" />
          <circle cx="1410" cy="320" r="3" />
          <circle cx="1220" cy="330" r="3" />
          <circle cx="320" cy="650" r="3" />
          <circle cx="250" cy="540" r="3" />
          <circle cx="350" cy="770" r="3" />
        </g>
      </svg>

      <div className="container relative z-10 grid min-h-[100svh] items-center gap-14 pb-24 pt-32 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 lg:pb-28 lg:pt-28">
        {/* copy */}
        <div className="relative">
          <motion.div
            className="flex flex-wrap items-center gap-3 text-[10px] tracking-[0.24em] text-[#F2E04E]/85"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Equalizer className="text-[#3DC1C5]" />
            <span className="eyebrow" dir="ltr">
              {dict.hero.eyebrow}
            </span>
            <span className="h-px w-10 bg-[#D1A246]/50" />
            <span className="font-grotesk text-gold-400" dir="ltr">
              2026
            </span>
          </motion.div>

          <h1 className="hero-title mt-6 font-display">
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={cn("block", i === 2 && "gold-text pb-[0.08em]")}
                  initial={false}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 1.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            className="mt-7 max-w-xl"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lg font-medium text-[#F2E04E] sm:text-xl">
              {dict.hero.subtitle}
            </p>
            <p className="mt-3 text-sm leading-8 text-[#F7F2E9]/64 sm:text-base">
              {dict.hero.body}
            </p>
          </motion.div>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                onMouseEnter={() => play("hover")}
                className="btn btn-primary"
              >
                {dict.hero.ctaPrimary}
                <ArrowUpRight className="rtl:-scale-x-100" size={18} />
              </button>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollToSection("services")}
                onMouseEnter={() => play("hover")}
                className="btn btn-ghost border-white/25 text-[#F7F2E9] hover:bg-white/10"
              >
                {dict.hero.ctaSecondary}
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
              </button>
            </Magnetic>
          </motion.div>

          <motion.div
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-2 text-[9px] uppercase tracking-[0.16em] text-[#F7F2E9]/40 sm:flex sm:flex-wrap sm:items-center sm:gap-x-4 sm:text-[10px] sm:tracking-[0.18em]"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            dir="ltr"
          >
            <span className="font-grotesk">SOUND</span>
            <span className="hidden h-px w-6 bg-white/20 sm:block" />
            <span className="font-grotesk">STRATEGY</span>
            <span className="hidden h-px w-6 bg-white/20 sm:block" />
            <span className="font-grotesk">VISION</span>
            <span className="hidden h-px w-6 bg-white/20 sm:block" />
            <span className="font-grotesk">IMPACT</span>
          </motion.div>
        </div>

        {/* visual */}
        <motion.div
          className="relative mx-auto w-full max-w-[540px] lg:mx-0"
          initial={reduced ? false : { opacity: 0, y: 24, scale: 0.96 }}
          animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute -top-7 end-4 h-24 w-24 rounded-full border border-gold/40 sm:h-32 sm:w-32">
            <span className="absolute inset-3 rounded-full border border-dashed border-gold/30 orbit" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Note className="rotate-12 text-gold-400" size={24} />
            </span>
          </div>

          <div className="relative">
            {/* vinyl peeking from behind */}
            <div className="absolute -top-12 end-0 h-52 w-52 animate-spin-slow rounded-full vinyl sm:h-64 sm:w-64">
              <div className="absolute left-1/2 top-1/2 flex h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full vinyl-label">
                <Note className="text-[#F7F2E9]/90" size={26} />
              </div>
            </div>

            <div
              ref={cardRef}
              onPointerMove={onCardMove}
              onPointerLeave={resetCard}
              className="relative [perspective:1200px]"
            >
              <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative rounded-stage border border-white/15 bg-[#F7F2E9] p-2.5 shadow-lift"
              >
                {/* gold hairline inside the cream frame */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-7 top-1.5 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(209,162,70,0.85), rgba(242,224,78,0.5), transparent)",
                  }}
                />
                <div className="relative aspect-[1.02] overflow-hidden rounded-[1.35rem] bg-[#F7F2E9]">
                  <Image
                    src={heroImage}
                    alt={dict.meta.ogAlt}
                    fill
                    priority
                    unoptimized={/^https?:\/\//i.test(heroImage)}
                    sizes="(max-width: 1024px) 88vw, 540px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07262F]/40 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 text-[8px] uppercase tracking-[0.22em] text-[#0B2730]/70">
                    <span dir="ltr" className="font-grotesk">
                      AN-001 / WAVE
                    </span>
                    <span className="flex items-center gap-1.5 font-grotesk" dir="ltr">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#F28C28]" />
                      LIVE
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                    <div>
                      <p className="font-grotesk text-[10px] tracking-[0.24em] text-white/80" dir="ltr">
                        ART ENERGY
                      </p>
                      <p className="mt-1 font-grotesk text-[7px] uppercase tracking-[0.16em] text-white/60" dir="ltr">
                        SOUND / VISION / IMPACT
                      </p>
                    </div>
                    <Equalizer className="mb-1 text-[#F2E04E]" bars={7} />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-3">
                  <span className="font-grotesk text-[8.5px] font-semibold tracking-[0.18em] text-[#0B2730]" dir="ltr">
                    {dict.hero.albumLabel}
                  </span>
                  <span className="truncate font-grotesk text-[7px] uppercase tracking-[0.14em] text-[#0B2730]/55" dir="ltr">
                    {dict.hero.albumSub}
                  </span>
                </div>

                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-stage opacity-30"
                  style={{
                    background:
                      "radial-gradient(420px circle at var(--gx, 50%) 0%, rgba(255,255,255,.7), transparent 60%)",
                    // @ts-expect-error CSS custom property
                    "--gx": glareX,
                  }}
                />
              </motion.div>
            </div>

            {/* floating now-playing card */}
            <motion.div
              className="absolute -bottom-8 start-0 z-10 flex w-[min(88%,300px)] items-center gap-3 rounded-card border border-white/15 bg-[#07262F]/90 p-3.5 shadow-glass backdrop-blur-xl sm:-start-6"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 1.05 }}
            >
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0E3F4D]">
                <span className="absolute inset-1 rounded-full border border-[#F2E04E]/30" />
                <Note className="text-[#F2E04E]" size={20} />
              </div>
              <div className="min-w-0">
                <p className="font-grotesk text-[9px] uppercase tracking-[0.22em] text-[#F2E04E]/90" dir="ltr">
                  NOW PLAYING
                </p>
                <p className="mt-1 truncate text-xs text-[#F7F2E9]/75">
                  {dict.hero.subtitle}
                </p>
              </div>
              <Equalizer className="ms-auto text-[#3DC1C5]" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.button
        type="button"
        onClick={() => scrollToSection("about")}
        className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-[#F7F2E9]/45 transition hover:text-[#F2E04E] sm:flex"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <span className="font-grotesk" dir="ltr">
          {dict.ui.scroll}
        </span>
        <span className="sr-only">{dict.hero.ctaSecondary}</span>
        <span className="relative h-9 w-px overflow-hidden bg-white/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-3 bg-[#F2E04E]"
            animate={{ y: [-12, 36] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        <ArrowDown size={13} />
      </motion.button>
    </section>
  );
}
