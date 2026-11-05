"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BrandMark } from "@/components/brand/Logo";
import { ChartColumn } from "@/components/ui/Icons";
import { Play, Sparkle } from "@/components/ui/Icons";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-15%" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

export function StrategyPreview() {
  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-card bg-[#07262F] p-5 text-[#F7F2E9]">
      <div className="dot-grid absolute inset-0 opacity-20" />
      <div className="relative flex items-center justify-between">
        <span className="font-grotesk text-[9px] tracking-[0.26em] text-[#F2E04E]/80" dir="ltr">
          STRATEGY / LAB
        </span>
        <span className="flex items-center gap-1.5 font-grotesk text-[8px] tracking-[0.2em] text-white/40" dir="ltr">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3DC1C5]" />
          LIVE
        </span>
      </div>

      <div className="relative mt-6 h-[54%] min-h-[170px]">
        <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="strategy-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3DC1C5" stopOpacity="0.35" />
              <stop offset="1" stopColor="#3DC1C5" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[40, 80, 120, 160, 200].map((y) => (
            <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#F7F2E9" strokeOpacity="0.06" />
          ))}
          <motion.path
            d="M0 180 C40 172 55 140 90 146 S150 176 185 128 S250 70 285 96 S345 116 400 42 V220 H0 Z"
            fill="url(#strategy-fill)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          />
          <motion.path
            d="M0 180 C40 172 55 140 90 146 S150 176 185 128 S250 70 285 96 S345 116 400 42"
            fill="none"
            stroke="#F2E04E"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
          <path
            d="M0 205 C60 198 80 186 120 190 S190 214 230 190 S310 172 400 176"
            fill="none"
            stroke="#3DC1C5"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            opacity="0.65"
          />
          <circle cx="400" cy="42" r="5" fill="#F2E04E" />
          <circle cx="400" cy="42" r="12" fill="none" stroke="#F2E04E" strokeOpacity="0.3" />
        </svg>
        <div className="absolute end-2 top-0 rounded-lg border border-white/10 bg-white/5 px-2 py-1 font-grotesk text-[8px] tracking-[0.18em] text-white/60" dir="ltr">
          03 / GROWTH
        </div>
      </div>

      <div className="relative mt-3 grid grid-cols-3 gap-2">
        {["MARKET", "PLAN", "MEASURE"].map((label, i) => (
          <div
            key={label}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-2 text-center font-grotesk text-[7.5px] tracking-[0.14em] text-white/60"
            dir="ltr"
          >
            <span className="mx-auto mb-1 block h-6 w-full overflow-hidden rounded-sm bg-white/5">
              <motion.span
                className="block h-full w-full origin-bottom bg-gradient-to-t from-[#139CAA] to-[#F2E04E]/70"
                initial={{ scaleY: 0.15 }}
                whileInView={{ scaleY: 0.9 - i * 0.14 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
              />
            </span>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function BrandPreview() {
  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-card border border-line bg-[#F3EDE1] p-5">
      <div className="absolute -end-10 -top-10 h-44 w-44 rounded-full bg-[#F2E04E]" />
      <div className="relative flex items-center justify-between">
        <span className="font-grotesk text-[9px] tracking-[0.26em] text-[#0B2730]/75" dir="ltr">
          IDENTITY / SYSTEM
        </span>
        <Sparkle size={16} className="text-[#0B2730]/75" />
      </div>

      <div className="relative mt-6 grid grid-cols-3 gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.06 }}
            className="flex aspect-square items-center justify-center rounded-xl border border-[#0B2730]/10 bg-[#FBF8F1]"
          >
            <BrandMark
              idPrefix={`brand-grid-${i}`}
              className={i === 4 ? "h-10 w-10 grayscale" : "h-10 w-10"}
            />
          </motion.div>
        ))}
      </div>

      <div className="relative mt-4 flex items-center justify-between rounded-xl border border-[#0B2730]/10 bg-[#FBF8F1] px-3 py-2.5">
        <span className="font-grotesk text-[8px] tracking-[0.2em] text-[#0B2730]/55" dir="ltr">
          PRIMARY / #139CAA
        </span>
        <div className="flex gap-1.5">
          <span className="h-4 w-4 rounded-full bg-[#139CAA]" />
          <span className="h-4 w-4 rounded-full bg-[#D1A246]" />
          <span className="h-4 w-4 rounded-full bg-[#F28C28]" />
          <span className="h-4 w-4 rounded-full bg-[#F2E04E]" />
        </div>
      </div>

      <motion.div
        className="absolute -bottom-8 -start-4 h-24 w-24 rounded-full border-[6px] border-[#FBF8F1] bg-[#0B2730] shadow-lg"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <BrandMark idPrefix="brand-badge" className="h-full w-full p-3" />
      </motion.div>
    </div>
  );
}

export function ContentPreview() {
  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-card bg-[#0B2730] p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(19,156,170,0.35),transparent_55%)]" />
      <div className="relative flex h-full items-center justify-center">
        <div className="relative h-[290px] w-[150px] rounded-panel border border-white/20 bg-[#04181E] p-2 shadow-2xl">
          <div className="absolute left-1/2 top-2 h-1 w-8 -translate-x-1/2 rounded-full bg-white/20" />
          <div className="mt-4 h-full overflow-hidden rounded-card bg-[#FBF8F1]">
            <div className="flex items-center gap-2 border-b border-black/5 px-2.5 py-2">
              <span className="h-5 w-5 rounded-full bg-[#139CAA]" />
              <span className="h-1.5 w-10 rounded-full bg-black/15" />
              <span className="ms-auto h-1.5 w-1.5 rounded-full bg-[#F28C28]" />
            </div>
            <div className="space-y-2 p-2">
              {[
                "bg-gradient-to-br from-[#139CAA] to-[#3DC1C5]",
                "bg-gradient-to-br from-[#D1A246] to-[#F2E04E]",
                "bg-gradient-to-br from-[#0B2730] to-[#0E4E59]",
              ].map((bg, i) => (
                <motion.div
                  key={bg}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 * i }}
                  className="overflow-hidden rounded-lg border border-black/5 bg-white"
                >
                  <div className={`h-14 w-full ${bg}`} />
                  <div className="space-y-1 p-1.5">
                    <span className="block h-1 w-3/4 rounded-full bg-black/15" />
                    <span className="block h-1 w-1/2 rounded-full bg-black/10" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <span className="absolute -end-3 top-16 rounded-full bg-[#F2E04E] p-1.5 text-[#0B2730] shadow-lg">
            <Play size={10} />
          </span>
        </div>

        <div className="absolute -start-1 top-1/2 flex -translate-y-1/2 flex-col gap-2">
          {["+", "◇", "↗", "♥"].map((c, i) => (
            <motion.span
              key={c}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xs text-white/70 backdrop-blur"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
            >
              {c}
            </motion.span>
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 start-5 flex items-center gap-2 font-grotesk text-[8px] tracking-[0.22em] text-white/45" dir="ltr">
        <ChartColumn size={13} className="text-[#F2E04E]" />
        CONTENT / 03
      </div>
    </div>
  );
}

export function ProductionPreview() {
  return (
    <div className="group relative h-full min-h-[320px] overflow-hidden rounded-card bg-[#04181E]">
      <Image
        src="/images/media-art.webp"
        alt=""
        fill
        sizes="(max-width: 1024px) 90vw, 460px"
        className="object-cover opacity-80 transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#04181E] via-[#04181E]/30 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-md transition group-hover:scale-110 group-hover:bg-[#F2E04E] group-hover:text-[#0B2730]">
          <span className="absolute inset-0 animate-ping rounded-full border border-white/20 [animation-duration:3s]" />
          <Play size={20} className="ms-0.5" />
        </span>
      </div>
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 font-grotesk text-[8px] tracking-[0.22em] text-white/70" dir="ltr">
        <span>REC / 04</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F28C28]" /> 00:24
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0">
        <div className="film-strip h-5 w-full opacity-40" />
        <div className="flex items-center gap-2 bg-[#04181E]/90 px-4 py-3">
          <Play size={10} className="text-[#F2E04E]" />
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-2/5 rounded-full bg-[#F2E04E]" />
          </div>
          <span className="font-grotesk text-[8px] tracking-[0.18em] text-white/50" dir="ltr">
            FILM / 04
          </span>
        </div>
      </div>
    </div>
  );
}

export function PrintPreview() {
  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-card border border-line bg-[#E9E1D2] p-5">
      <div className="paper-lines absolute inset-0 opacity-40" />
      <div className="relative flex items-center justify-between">
        <span className="font-grotesk text-[9px] tracking-[0.26em] text-[#0B2730]/55" dir="ltr">
          PRINT / 05
        </span>
        <span className="font-grotesk text-[8px] tracking-[0.2em] text-[#0B2730]/70" dir="ltr">
          A4 — A5 — DL
        </span>
      </div>

      <div className="book relative mx-auto mt-6 h-[210px] w-[190px]">
        <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-r-md rounded-l-sm bg-[#0B2730]/10" />
        <div className="absolute inset-0 overflow-hidden rounded-r-md rounded-l-sm border border-[#0B2730]/15 bg-[#0B2730] shadow-xl">
          <div className="flex h-full flex-col justify-between p-4 text-[#F7F2E9]">
            <span className="font-grotesk text-[7px] tracking-[0.26em] text-[#F2E04E]/80" dir="ltr">
              ART ENERGY
            </span>
            <div>
              <span className="block h-[2px] w-8 bg-[#D1A246]" />
              <p className="mt-2 font-grotesk text-lg font-semibold leading-none" dir="ltr">
                PROFILE
              </p>
              <p className="mt-1 font-grotesk text-[6px] uppercase tracking-[0.2em] text-white/50" dir="ltr">
                PRODUCTION & TECHNICAL CONSULTING
              </p>
            </div>
            <BrandMark idPrefix="print-cover" className="h-9 w-9" />
          </div>
        </div>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="book-page absolute inset-y-1 start-0 w-full rounded-r-md border border-[#0B2730]/10 bg-[#FBF8F1] p-4 shadow-md"
            style={{ zIndex: 3 - i }}
          >
            <div className="space-y-2">
              <span className="block h-1 w-10 bg-[#D1A246]" />
              <span className="block h-1.5 w-3/4 bg-[#0B2730]/25" />
              <span className="block h-1 w-full bg-[#0B2730]/10" />
              <span className="block h-1 w-5/6 bg-[#0B2730]/10" />
              <div className="grid grid-cols-2 gap-1.5 pt-2">
                <span className="block h-12 rounded-sm bg-[#139CAA]/30" />
                <span className="block h-12 rounded-sm bg-[#D1A246]/40" />
              </div>
              <span className="block h-1 w-2/3 bg-[#0B2730]/10" />
              <span className="block h-1 w-1/2 bg-[#0B2730]/10" />
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-4 flex items-center justify-between text-[8px] font-medium uppercase tracking-[0.2em] text-[#0B2730]/70" dir="ltr">
        <span>BROCHURE</span>
        <span>CATALOGUE</span>
        <span>REPORT</span>
      </div>
    </div>
  );
}

export function CampaignPreview() {
  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-card bg-[#07262F] p-5 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(209,162,70,0.16),transparent_60%)]" />
      <div className="relative flex items-center justify-between">
        <span className="font-grotesk text-[9px] tracking-[0.26em] text-[#F2E04E]/80" dir="ltr">
          CAMPAIGN / 06
        </span>
        <ChartColumn size={13} className="text-[#3DC1C5]" />
      </div>

      <div className="relative mx-auto mt-6 aspect-square w-[220px]">
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="orbit absolute inset-4 rounded-full border border-dashed border-[#D1A246]/40" />
        <div className="orbit-reverse absolute inset-10 rounded-full border border-[#3DC1C5]/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border border-[#F2E04E]/40 bg-[#07262F]/80 text-center backdrop-blur">
            <span className="font-grotesk text-[7px] tracking-[0.22em] text-[#F2E04E]" dir="ltr">
              IDEA
            </span>
            <span className="my-0.5 h-px w-6 bg-[#D1A246]/60" />
            <span className="font-grotesk text-[7px] tracking-[0.22em] text-white/60" dir="ltr">
              IMPACT
            </span>
          </div>
        </div>
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x = 50 + Math.cos(rad) * 44;
          const y = 50 + Math.sin(rad) * 44;
          return (
            <span
              key={deg}
              className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#0E3F4D] font-grotesk text-[7px] text-[#F2E04E]"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              0{i + 1}
            </span>
          );
        })}
      </div>

      <div className="relative mt-4 flex h-8 items-end justify-center gap-1">
        {[14, 26, 10, 32, 18, 28, 12, 24, 16, 30, 8, 22].map((h, i) => (
          <motion.span
            key={i}
            className="w-1.5 rounded-sm bg-gradient-to-t from-[#139CAA] to-[#F2E04E]"
            animate={{ height: [h * 0.4, h, h * 0.6] }}
            transition={{ duration: 1.4 + i * 0.08, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
            style={{ height: h }}
          />
        ))}
      </div>
    </div>
  );
}

export const previews = [
  StrategyPreview,
  BrandPreview,
  ContentPreview,
  ProductionPreview,
  PrintPreview,
  CampaignPreview,
];
