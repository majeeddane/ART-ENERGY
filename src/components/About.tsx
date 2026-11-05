"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { Eye, Send, Sparkle, Check, Lightbulb } from "@/components/ui/Icons";
import { SectionLabel } from "@/components/ui/Section";
import { WordReveal, Reveal } from "@/components/ui/Reveal";
import { useDict } from "@/components/providers/SiteDataProvider";
import type { Locale } from "@content/model";

function IdeaVisual({ top, bottom }: { top: string; bottom: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "center 0.3"],
  });

  const qOpacity = useTransform(scrollYProgress, [0, 0.52, 0.62], [1, 1, 0]);
  const qScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.82]);
  const qRotate = useTransform(scrollYProgress, [0, 0.6], [0, -24]);
  const qY = useTransform(scrollYProgress, [0, 0.6], [0, -18]);

  const ideaOpacity = useTransform(scrollYProgress, [0.45, 0.72], [0, 1]);
  const ideaScale = useTransform(scrollYProgress, [0.45, 0.9], [0.78, 1]);
  const ideaRotate = useTransform(scrollYProgress, [0.45, 0.9], [12, 0]);

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[440px]">
      <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-gold/30" />
      <div className="absolute inset-6 rounded-full border border-ink/10" />
      <div className="absolute inset-0 rounded-full bg-[#F2E04E] shadow-[0_40px_90px_-40px_rgba(209,162,70,0.7)]" />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.55),transparent_55%)]" />
      <div className="dot-grid absolute inset-0 rounded-full opacity-[0.16]" />

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="absolute"
          style={
            reduced
              ? { opacity: 0 }
              : { opacity: qOpacity, scale: qScale, rotate: qRotate, y: qY }
          }
        >
          <svg viewBox="0 0 200 240" className="h-[58%] w-[58%]" aria-hidden>
            <text
              x="100"
              y="188"
              textAnchor="middle"
              fontFamily="var(--font-grotesk), sans-serif"
              fontWeight="700"
              fontSize="210"
              fill="#0B2730"
            >
              ?
            </text>
          </svg>
        </motion.div>

        <motion.div
          className="absolute flex items-center justify-center text-[#0B2730]"
          style={
            reduced
              ? { opacity: 1 }
              : { opacity: ideaOpacity, scale: ideaScale, rotate: ideaRotate }
          }
        >
          <span className="absolute h-[78%] w-[78%] rounded-full border border-ink/15" />
          <span className="absolute h-[62%] w-[62%] rounded-full border border-dashed border-ink/20" />
          <Lightbulb size={148} strokeWidth={1.1} />
        </motion.div>
      </div>

      <span className="absolute -start-3 top-8 rounded-full border border-ink/15 bg-[#FBF8F1] px-3 py-1.5 font-grotesk text-[9px] tracking-[0.24em] text-ink/70" dir="ltr">
        {top}
      </span>
      <span className="absolute -end-2 bottom-8 rounded-full bg-[#0B2730] px-3 py-1.5 font-grotesk text-[9px] tracking-[0.24em] text-[#F2E04E]" dir="ltr">
        {bottom}
      </span>
      <Sparkle className="absolute end-10 top-12 text-ink/50" size={20} />
    </div>
  );
}

function FlipCard({
  label,
  text,
  index,
  hint,
  icon,
}: {
  label: string;
  text: string;
  index: string;
  hint: string;
  icon: "eye" | "send";
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="flip h-[250px] w-full"
      data-flipped={flipped}
      onClick={() => setFlipped((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((v) => !v);
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${label} — ${hint}`}
    >
      <div className="flip-inner">
        <div className="flip-face flex flex-col justify-between border border-line bg-card p-7 shadow-soft">
          <div className="flex items-start justify-between">
            <span className="font-grotesk text-[10px] tracking-[0.24em] text-gold-700">
              {index}
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold-700">
              {icon === "eye" ? <Eye size={20} /> : <Send size={20} />}
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-bold">{label}</h3>
            <p className="mt-3 inline-flex items-center gap-2 text-xs text-muted">
              {hint}
              <span aria-hidden className="inline-block h-px w-6 bg-gold" />
            </p>
          </div>
        </div>
        <div className="flip-face flip-back flex flex-col justify-between bg-[var(--night-3)] p-7 text-[#F7F2E9]">
          <div className="flex items-center justify-between">
            <span className="eyebrow text-[#F2E04E]">{label}</span>
            <span className="font-grotesk text-[10px] tracking-[0.24em] text-white/40">
              {index}
            </span>
          </div>
          <p className="text-lg font-medium leading-9">{text}</p>
          <span className="h-px w-full bg-gradient-to-r from-[#F2E04E]/60 to-transparent" />
        </div>
      </div>
    </div>
  );
}

export function About({ locale }: { locale: Locale }) {
  const dict = useDict(locale);
  return (
    <section id="about" className="relative overflow-hidden bg-canvas py-24 sm:py-32">
      <div className="pointer-events-none absolute -end-24 top-10 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="container relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <SectionLabel>{dict.about.label}</SectionLabel>
            <Reveal>
              <p className="mt-6 flex items-center gap-3 font-grotesk text-[10px] uppercase tracking-[0.3em] text-gold-700">
                <span className="h-px w-10 bg-gold" /> {dict.about.kicker}
              </p>
            </Reveal>
            <h2 className="section-title mt-3 max-w-2xl font-display">
              {dict.about.title}
            </h2>
            <WordReveal
              text={dict.about.body}
              className="mt-7 max-w-2xl text-lg leading-9 text-muted sm:text-xl sm:leading-10"
            />

            <ul className="mt-9 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {dict.about.specialties.map((item, i) => (
                <li key={item}>
                  <Reveal
                    delay={i * 0.05}
                    className="flex items-center gap-3 border-b border-line pb-3 text-sm font-medium"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-700">
                      <Check size={13} />
                    </span>
                    {item}
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>

          <Reveal y={40} className="relative">
            <IdeaVisual top={dict.about.visualTop} bottom={dict.about.visualBottom} />
            <p className="mx-auto mt-6 max-w-[300px] text-center text-[11px] uppercase tracking-[0.22em] text-muted">
              {dict.about.flipHint}
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:mt-20">
          <Reveal>
            <FlipCard
              index="01"
              label={dict.about.visionLabel}
              text={dict.about.vision}
              hint={dict.about.flipHint}
              icon="eye"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <FlipCard
              index="02"
              label={dict.about.missionLabel}
              text={dict.about.mission}
              hint={dict.about.flipHint}
              icon="send"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
