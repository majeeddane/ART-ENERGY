"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { SectionLabel } from "@/components/ui/Section";
import {
  ChartColumn,
  Clapperboard,
  Palette,
  PenTool,
  Target,
} from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { useDict } from "@/components/providers/SiteDataProvider";
import type { Locale } from "@content/model";

const stageIcons = [Target, Palette, PenTool, Clapperboard, ChartColumn];

export function Journey({ locale }: { locale: Locale }) {
  const dict = useDict(locale);
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const stages = dict.journey.stages;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.55"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const scaleY = useTransform(smooth, [0, 1], [0, 1]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      // The stage HUD only exists on lg+; skip the layout reads on mobile.
      if (window.innerWidth < 1024) return;
      const line = window.innerHeight * 0.35;
      let next = 0;
      stages.forEach((stage, index) => {
        const el = document.getElementById(`journey-${stage.number}`);
        if (el && el.getBoundingClientRect().top <= line) next = index;
      });
      setActive((current) => (current === next ? current : next));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [stages]);

  const goToStage = (index: number) => {
    const el = document.getElementById(`journey-${stages[index].number}`);
    if (!el) return;
    // Park the stage in the upper third: the sticky HUD stays on screen
    // even for the last stage, without scrolling the section out of view.
    const top =
      el.getBoundingClientRect().top +
      window.scrollY -
      window.innerHeight * 0.3;
    const lenis = (
      window as unknown as {
        __lenis?: { scrollTo: (t: Element | number, o?: object) => void };
      }
    ).__lenis;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (lenis) {
      lenis.scrollTo(top, { duration: reduced ? 0 : 1.1 });
    } else {
      window.scrollTo({
        top,
        behavior: reduced ? "auto" : "smooth",
      });
    }
  };

  return (
    <section
      id="journey"
      className="on-dark relative overflow-x-clip bg-[var(--night-2)] py-24 text-[#F7F2E9] sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(19,156,170,0.18),transparent_50%)]" />
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.08]" />
      <div className="container relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <SectionLabel tone="light">{dict.journey.label}</SectionLabel>
          <Reveal>
            <h2 className="section-title mt-5 max-w-md font-display">
              {dict.journey.title}
            </h2>
          </Reveal>
          <p className="mt-5 text-sm text-white/45">{dict.journey.hint}</p>

          <nav
            aria-label={dict.journey.stagesLabel}
            className="mt-7 hidden lg:block"
          >
            <div className="flex items-end justify-between border-t border-white/10 pt-4">
              <span className="text-[10px] tracking-[0.18em] text-white/40">
                {dict.journey.counter}
              </span>
              <span
                className="font-grotesk text-[9px] tracking-[0.22em] text-white/35"
                dir="ltr"
              >
                {stages[active].number} / {stages[stages.length - 1].number}
              </span>
            </div>
            <div className="mt-1.5 flex items-baseline gap-3">
              <span className="font-display text-4xl leading-none text-[#F2E04E]">
                {stages[active].number}
              </span>
              <span className="pb-0.5 text-sm text-white/55">
                {stages[active].title}
              </span>
            </div>
            <ul className="mt-4 grid grid-cols-5 gap-1">
              {stages.map((stage, i) => (
                <li key={stage.number}>
                  <button
                    type="button"
                    onClick={() => goToStage(i)}
                    aria-current={active === i ? "step" : undefined}
                    title={stage.title}
                    className={cn(
                      "flex w-full flex-col items-center gap-1.5 border-t-2 pt-2 transition-colors duration-300",
                      active === i
                        ? "border-[#F2E04E] text-[#F2E04E]"
                        : "border-white/10 text-white/35 hover:border-white/30 hover:text-white/70",
                    )}
                  >
                    <span className="font-grotesk text-[10px] tracking-[0.16em]">
                      {stage.number}
                    </span>
                    <span className="w-full truncate text-center text-[9px] leading-tight">
                      {stage.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-6 hidden max-w-sm rounded-card border border-white/10 bg-white/[0.03] p-4 shadow-glass backdrop-blur-sm xl:block [@media(max-height:900px)]:hidden">
            <div className="flex items-center justify-between">
              <span className="font-grotesk text-[9px] tracking-[0.24em] text-white/40" dir="ltr">
                THE ROADMAP
              </span>
              <span className="flex items-center gap-1.5 font-grotesk text-[8px] tracking-[0.18em] text-[#F2E04E]/70" dir="ltr">
                <ChartColumn size={12} />
                IDEA → IMPACT
              </span>
            </div>
            <div className="relative mt-5 flex items-center justify-between">
              <span
                aria-hidden
                className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-teal-400/40 via-gold/40 to-[#F2E04E]/50"
              />
              {stageIcons.map((Icon, i) => (
                <motion.span
                  key={i}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[var(--night-3)] text-[#F2E04E]"
                  animate={reduced ? undefined : { y: [0, -5, 0] }}
                  transition={{
                    duration: 3 + i * 0.35,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Icon size={15} />
                </motion.span>
              ))}
            </div>
            <div className="mt-3 flex justify-between font-grotesk text-[8px] tracking-[0.18em] text-white/30" dir="ltr">
              <span>IDEA</span>
              <span>IMPACT</span>
            </div>
          </div>
        </div>

        <div ref={ref} className="relative ps-10 sm:ps-16">
          <div className="absolute inset-y-0 start-[calc(1rem-0.5px)] w-px bg-white/10 sm:start-[calc(1.375rem-0.5px)]" />
          <motion.div
            className="absolute inset-y-0 start-[calc(1rem-0.5px)] w-px origin-top bg-gradient-to-b from-[#3DC1C5] via-[#D1A246] to-[#F2E04E] sm:start-[calc(1.375rem-0.5px)]"
            style={{ scaleY }}
          />

          <div className="space-y-14 sm:space-y-20">
            {dict.journey.stages.map((stage, i) => (
              <motion.div
                key={stage.number}
                id={`journey-${stage.number}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="relative scroll-mt-28"
              >
                <span className="absolute -start-10 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-[#D1A246]/50 bg-[var(--night-2)] text-[#F2E04E] shadow-lg sm:-start-16 sm:h-11 sm:w-11">
                  {(() => {
                    const Icon = stageIcons[i % stageIcons.length];
                    return <Icon size={i === 4 ? 19 : 16} />;
                  })()}
                  <span className="absolute inset-0 animate-ping rounded-full border border-[#F2E04E]/20 [animation-duration:4s]" />
                </span>

                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-grotesk text-[10px] tracking-[0.24em] text-[#D1A246]">
                    {stage.number}
                  </span>
                  <h3 className="text-2xl font-bold sm:text-3xl">{stage.title}</h3>
                </div>
                <p className="mt-3 max-w-md text-sm leading-7 text-white/55 sm:text-base">
                  {stage.text}
                </p>
                <div className="mt-5 h-px w-full max-w-md bg-gradient-to-r from-white/15 to-transparent" />
              </motion.div>
            ))}
          </div>

          <div className="relative mt-6 flex items-center gap-3 ps-1">
            <span className="h-2 w-2 rounded-full bg-[#F2E04E]" />
            <span className="font-grotesk text-[9px] tracking-[0.24em] text-[#F2E04E]/70" dir="ltr">
              FINAL NOTE / IMPACT
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
