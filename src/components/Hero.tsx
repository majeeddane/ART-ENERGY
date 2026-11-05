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
import {
  ArrowDown,
  ArrowUpRight,
  Megaphone,
  Palette,
  Play,
  Share2,
} from "@/components/ui/Icons";
import { GrowthMeter } from "@/components/ui/Section";
import { Magnetic } from "@/components/ui/Magnetic";
import { useSound } from "@/components/providers/SoundProvider";
import { cn, scrollToSection } from "@/lib/utils";
import { useDict, useSettings } from "@/components/providers/SiteDataProvider";
import type { Locale } from "@content/model";

export function Hero({ locale }: { locale: Locale }) {
  const dict = useDict(locale);
  const settings = useSettings();
  const heroImage = settings.heroImage || "/images/media-art.webp";
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
    // Compose the hero behind the preloader so the curtain reveals a finished scene.
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
    ry.set(px * 8);
    rx.set(-py * 8);
  };

  const resetCard = () => {
    rx.set(0);
    ry.set(0);
  };

  const lines = [dict.hero.titleA, dict.hero.titleB, dict.hero.titleC];
  const eyebrowParts = dict.hero.eyebrow
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);
  const mobileEyebrow = eyebrowParts.slice(0, 2).join(" · ");

  const channels = [
    { Icon: Megaphone, label: "ADVERTISING" },
    { Icon: Share2, label: "DIGITAL" },
    { Icon: Palette, label: "CONTENT" },
    { Icon: Play, label: "PRODUCTION" },
  ];

  return (
    <section
      id="home"
      className="on-dark relative isolate min-h-[100svh] overflow-hidden bg-[var(--night-bg)] text-[var(--night-fg)]"
    >
      {/* background — layered studio night */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_72%_12%,var(--night-3)_0%,var(--night-2)_38%,var(--night-bg)_74%)]" />
      <div className="absolute inset-0 opacity-[0.45]">
        <ThreeWaves className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute -start-40 top-1/4 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,var(--night-glow),transparent_66%)]" />
      <div className="pointer-events-none absolute -end-36 -top-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,var(--night-glow-2),transparent_66%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/55 to-transparent" />

      {/* editorial grid lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #f7f2e9 1px, transparent 1px)",
          backgroundSize: "min(12.5vw, 180px) 100%",
        }}
      />

      <div className="container relative z-10 grid min-h-[100svh] items-center gap-14 pb-24 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-28 lg:pt-28">
        {/* copy */}
        <div className="relative">
          <motion.div
            className="flex items-center gap-3 text-[9px] tracking-[0.16em] text-[#F2E04E]/85 sm:text-[10px] sm:tracking-[0.22em]"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Megaphone size={15} className="shrink-0 text-[#3DC1C5]" />
            <span className="eyebrow min-w-0 flex-1 whitespace-nowrap" dir="ltr">
              <span className="sm:hidden">{mobileEyebrow}</span>
              <span className="hidden sm:inline">{dict.hero.eyebrow}</span>
            </span>
            <span className="hidden h-px w-8 shrink-0 bg-[#D1A246]/50 sm:block" />
            <span className="hidden shrink-0 font-grotesk text-gold-400 sm:inline" dir="ltr">
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
            className="mt-8 flex items-center justify-between gap-x-2 text-[8px] uppercase tracking-[0.1em] text-[#F7F2E9]/45 sm:mt-10 sm:gap-x-5 sm:text-[10px] sm:tracking-[0.18em]"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            dir="ltr"
          >
            {channels.map(({ Icon, label }, i) => (
              <span key={label} className="flex items-center gap-4">
                {i > 0 && <span className="hidden h-px w-5 bg-white/15 sm:block" />}
                <span className="flex items-center gap-1.5 whitespace-nowrap font-grotesk">
                  <Icon size={12} className="shrink-0 text-teal-300/70" />
                  {label}
                </span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* visual — showreel frame */}
        <motion.div
          className="relative mx-auto w-full max-w-[560px] lg:mx-0"
          initial={reduced ? false : { opacity: 0, y: 24, scale: 0.96 }}
          animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* showreel frame */}
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
                  sizes="(max-width: 1024px) 88vw, 560px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04181E]/85 via-[#04181E]/10 to-[#04181E]/40" />

                <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 text-[8px] uppercase tracking-[0.22em] text-[#F7F2E9]/80">
                  <span dir="ltr" className="font-grotesk">
                    SHOWREEL / 01
                  </span>
                  <span className="flex items-center gap-1.5 font-grotesk" dir="ltr">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F28C28]" />
                    LIVE
                  </span>
                </div>

                {/* play mark */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/10 text-[#F7F2E9] backdrop-blur-md sm:h-20 sm:w-20">
                    <span className="absolute inset-0 animate-ping rounded-full border border-white/20 [animation-duration:4s]" />
                    <Play size={22} className="ms-0.5" fill="currentColor" />
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                  <div>
                    <p className="font-grotesk text-[10px] tracking-[0.24em] text-white/85" dir="ltr">
                      ART ENERGY
                    </p>
                    <p className="mt-1 font-grotesk text-[7px] uppercase tracking-[0.16em] text-white/55" dir="ltr">
                      {dict.hero.liveLabel}
                    </p>
                  </div>
                  <GrowthMeter className="mb-1 text-[#F2E04E]" bars={5} />
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

          {/* floating capability card */}
          <motion.div
            className="absolute -bottom-9 start-0 z-10 flex w-[min(92%,330px)] items-center gap-3 rounded-card border border-white/15 bg-[#07262F]/[0.92] p-3.5 shadow-glass backdrop-blur-xl sm:-start-6"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 1 }}
          >
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0E3F4D] text-[#F2E04E]">
              <span className="absolute inset-1 rounded-full border border-[#F2E04E]/25" />
              <Megaphone size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-grotesk text-[9px] uppercase tracking-[0.2em] text-[#F2E04E]/90" dir="ltr">
                FULL-SERVICE
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#F7F2E9]/75">
                {dict.hero.subtitle}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 text-teal-300">
              <Palette size={13} />
              <Share2 size={13} />
              <Play size={13} />
            </div>
          </motion.div>
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
