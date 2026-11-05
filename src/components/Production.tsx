"use client";

import { useRef } from "react";
import { SectionLabel } from "@/components/ui/Section";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Clapperboard,
  Film,
  PlayCircle,
  Plus,
  Sparkle,
  Video,
} from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { useQuote } from "@/components/providers/QuoteProvider";
import { useSound } from "@/components/providers/SoundProvider";
import { cn, scrollToSection } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { useDict } from "@/components/providers/SiteDataProvider";
import type { Locale } from "@content/model";

const reelIcons = [PlayCircle, Film, Clapperboard, Video, Camera];

const reelGlow = [
  "rgba(61,193,197,0.34)",
  "rgba(242,224,78,0.24)",
  "rgba(242,140,40,0.26)",
  "rgba(19,156,170,0.32)",
  "rgba(232,201,126,0.24)",
];

export function Production({ locale }: { locale: Locale }) {
  const dict = useDict(locale);
  const railRef = useRef<HTMLDivElement>(null);
  const { quote, toggleProduction } = useQuote();
  const { play } = useSound();

  const scrollRail = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const amount = (locale === "ar" ? -1 : 1) * dir * 330;
    rail.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section
      id="production"
      className="relative overflow-hidden border-y border-ink/10 bg-[#F3EDE1] py-24 text-[#0B2730] sm:py-32"
    >
      <div className="pointer-events-none absolute -end-20 top-0 h-72 w-72 rounded-full bg-[#F2E04E]/30 blur-3xl" />
      <div className="container relative">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <SectionLabel>{dict.production.label}</SectionLabel>
            <Reveal>
              <h2 className="section-title mt-5 max-w-2xl font-display">
                {dict.production.title}
              </h2>
            </Reveal>
            <p className="mt-4 max-w-md text-sm leading-7 text-[#0B2730]/55">
              {dict.production.note}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollRail(-1)}
              aria-label={dict.ui.previous}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0B2730]/20 transition hover:bg-[#0B2730] hover:text-[#F2E04E]"
            >
              <ArrowLeft size={17} className="rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => scrollRail(1)}
              aria-label={dict.ui.next}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0B2730]/20 transition hover:bg-[#0B2730] hover:text-[#F2E04E]"
            >
              <ArrowRight size={17} className="rtl:rotate-180" />
            </button>
          </div>
        </div>

        <div
          ref={railRef}
          className="no-scrollbar rail -mx-5 mt-10 px-5 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
        >
          {dict.production.items.map((item, i) => {
            const active = quote.production.includes(item.number);
            const Icon = reelIcons[i % reelIcons.length];
            return (
              <article
                key={item.number}
                className="group w-[270px] sm:w-[305px]"
              >
                <div className="relative aspect-square overflow-hidden rounded-card bg-[#0B2730] p-4 text-[#F7F2E9] shadow-[0_20px_50px_-30px_rgba(11,39,48,0.8)] transition duration-500 group-hover:-translate-y-1">
                  <div
                    className="absolute inset-0 bg-[linear-gradient(160deg,#0B3B48_0%,#07262F_58%,#04181E_100%)]"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(circle at 72% 18%, ${reelGlow[i % reelGlow.length]}, transparent 62%)`,
                    }}
                  />
                  <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.14]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_16%,rgba(255,255,255,0.14),transparent_58%)]" />

                  <div className="relative flex items-center justify-between">
                    <span className="font-grotesk text-[9px] tracking-[0.24em] text-[#F2E04E]/85" dir="ltr">
                      REEL / {item.number}
                    </span>
                    <Clapperboard size={14} className="text-[#F2E04E]/65" />
                  </div>

                  {/* frame — reads as a screen, not a record */}
                  <div className="pointer-events-none absolute inset-x-4 bottom-24 top-12 flex items-center justify-center">
                    <div className="relative flex h-full w-full items-center justify-center rounded-xl border border-white/12 bg-white/[0.04]">
                      <span className="absolute left-2 top-2 h-2 w-2 border-l border-t border-[#F2E04E]/55" />
                      <span className="absolute right-2 top-2 h-2 w-2 border-r border-t border-[#F2E04E]/55" />
                      <span className="absolute bottom-2 left-2 h-2 w-2 border-b border-l border-[#F2E04E]/55" />
                      <span className="absolute bottom-2 right-2 h-2 w-2 border-b border-r border-[#F2E04E]/55" />
                      <Icon
                        size={46}
                        strokeWidth={1.2}
                        className="text-[#F2E04E] transition duration-700 group-hover:scale-110"
                      />
                      <span
                        aria-hidden
                        className="absolute bottom-1.5 end-3 font-grotesk text-[52px] font-bold leading-none text-white/[0.07]"
                        dir="ltr"
                      >
                        {item.number}
                      </span>
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#04181E] via-[#04181E]/82 to-transparent p-4 pt-12">
                    <h3 className="text-lg font-bold leading-6">{item.title}</h3>
                    <p className="mt-1 flex items-baseline gap-1.5 font-grotesk text-[11px] text-[#F2E04E]">
                      <span className="text-[8px] uppercase tracking-[0.16em] text-white/40" dir="ltr">
                        {dict.ui.from}
                      </span>
                      <span className="text-sm font-semibold" dir="ltr">
                        {formatNumber(item.price, locale)}
                      </span>
                      <span className="text-[8px] text-white/40">{dict.ui.sar}</span>
                    </p>
                  </div>

                  <Sparkle
                    className="absolute end-4 top-9 text-[#F2E04E]/35"
                    size={12}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    toggleProduction(item.number, item.title);
                    play(active ? "click" : "success");
                  }}
                  aria-pressed={active}
                  className={cn(
                    "mt-3 flex w-full items-center justify-between gap-2 rounded-full border px-4 py-3 text-xs font-semibold transition",
                    active
                      ? "border-[#0B2730] bg-[#0B2730] text-[#F2E04E]"
                      : "border-[#0B2730]/20 bg-[#FBF8F1] text-[#0B2730] hover:border-[#0B2730]",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border",
                        active
                          ? "border-[#F2E04E] bg-[#F2E04E] text-[#0B2730]"
                          : "border-[#0B2730]/25",
                      )}
                    >
                      {active ? <Check size={11} /> : <Plus size={11} />}
                    </span>
                    {active ? dict.ui.selected : dict.production.add}
                  </span>
                  <span className="font-grotesk text-[9px] tracking-[0.16em] text-[#0B2730]/70" dir="ltr">
                    {dict.ui.from} {formatNumber(item.price, locale)}
                  </span>
                </button>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#0B2730]/10 pt-6">
          <p className="text-xs text-[#0B2730]/70">
            {dict.packages.builder.selectedLabel}: {quote.production.length}
          </p>
          <button
            type="button"
            onClick={() => scrollToSection("packages")}
            className="inline-flex items-center gap-2 text-xs font-semibold underline-offset-4 hover:underline"
          >
            {dict.packages.tabBuilder}
            <ArrowLeft size={14} className="rtl:rotate-180" />
          </button>
        </div>
      </div>
    </section>
  );
}
