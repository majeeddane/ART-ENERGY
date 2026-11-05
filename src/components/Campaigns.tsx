"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/Section";
import { ArrowUpRight, Megaphone } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { useQuote } from "@/components/providers/QuoteProvider";
import { useSound } from "@/components/providers/SoundProvider";
import { scrollToSection } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { useDict, useSettings } from "@/components/providers/SiteDataProvider";
import type { Locale } from "@content/model";

export function Campaigns({ locale }: { locale: Locale }) {
  const dict = useDict(locale);
  const settings = useSettings();
  const { setServiceFocus } = useQuote();
  const { play } = useSound();
  const steps = dict.campaigns.steps;

  const discuss = () => {
    setServiceFocus(dict.services.items[5]?.title ?? dict.campaigns.title);
    scrollToSection("contact");
  };

  return (
    <section
      id="campaigns"
      className="on-dark relative overflow-hidden bg-[var(--night-bg)] py-24 text-[#F7F2E9] sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(209,162,70,0.14),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,rgba(19,156,170,0.18),transparent_40%)]" />
      <div className="container relative">
        <div className="grid items-center gap-16 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <SectionLabel tone="light">{dict.campaigns.label}</SectionLabel>
            <Reveal>
              <h2 className="section-title mt-5 max-w-xl font-display">
                {dict.campaigns.title}
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/55 sm:text-base">
                {dict.campaigns.text}
              </p>
            </Reveal>

            <div className="mt-10 flex flex-wrap items-end gap-6">
              <div className="rounded-card border border-[#D1A246]/30 bg-white/[0.03] px-5 py-4 shadow-glass backdrop-blur">
                <span className="eyebrow text-[8px] text-[#F2E04E]/60">
                  {dict.campaigns.rangeLabel}
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-grotesk text-2xl font-semibold sm:text-3xl" dir="ltr">
                    {formatNumber(settings.campaignMin, locale)}
                  </span>
                  <span className="text-[#D1A246]">—</span>
                  <span className="font-grotesk text-2xl font-semibold sm:text-3xl" dir="ltr">
                    {formatNumber(settings.campaignMax, locale)}
                  </span>
                  <span className="text-xs text-white/45">{dict.ui.sar}</span>
                </div>
              </div>
              <span className="h-10 w-px bg-white/10" />
              <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-white/35" dir="ltr">
                <Megaphone size={18} className="text-[#F2E04E]/70" />
                BIG GOALS / BIG IMPACT
              </div>
            </div>

            <button
              type="button"
              onClick={discuss}
              onMouseEnter={() => play("hover")}
              className="btn btn-gold mt-8"
            >
              {dict.campaigns.cta}
              <ArrowUpRight size={16} className="rtl:-scale-x-100" />
            </button>
          </div>

          <div className="relative mx-auto w-full max-w-[500px]">
            <div className="relative aspect-square w-full">
              <div className="absolute inset-[4%] rounded-full border border-white/10" />
              <div className="orbit absolute inset-[10%] rounded-full border border-dashed border-[#D1A246]/35" />
              <div className="orbit-reverse absolute inset-[20%] rounded-full border border-[#3DC1C5]/20" />
              <div className="absolute inset-[30%] rounded-full border border-white/10" />

              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="flex h-[38%] w-[38%] flex-col items-center justify-center rounded-full border border-[#F2E04E]/30 bg-[#07262F]/80 text-center backdrop-blur-md"
                  animate={{ boxShadow: ["0 0 0 0 rgba(242,224,78,0.0)", "0 0 0 18px rgba(242,224,78,0.03)", "0 0 0 0 rgba(242,224,78,0.0)"] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <span className="font-grotesk text-[7px] tracking-[0.24em] text-[#F2E04E]/70" dir="ltr">
                    CAMPAIGN
                  </span>
                  <span className="mt-1 font-grotesk text-xl font-semibold" dir="ltr">
                    {formatNumber(settings.campaignMin, locale)}
                  </span>
                  <span className="my-0.5 h-px w-6 bg-[#D1A246]/60" />
                  <span className="font-grotesk text-xl font-light text-[#F2E04E]" dir="ltr">
                    {formatNumber(settings.campaignMax, locale)}
                  </span>
                  <span className="mt-1 text-[8px] text-white/40">{dict.ui.sar}</span>
                </motion.div>
              </div>

              {steps.map((step, i) => {
                const angle = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
                const x = 50 + Math.cos(angle) * 45;
                const y = 50 + Math.sin(angle) * 45;
                return (
                  <motion.div
                    key={step}
                    className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
                    style={{ left: `${x}%`, top: `${y}%` }}
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D1A246]/50 bg-[#04181E] font-grotesk text-[9px] text-[#F2E04E] shadow-lg">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="max-w-[92px] text-center text-[9px] leading-3 text-white/60 sm:text-[10px] sm:leading-4">
                      {step}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-5 font-grotesk text-[9px] tracking-[0.22em] text-white/35" dir="ltr">
              <span>IDEA</span>
              <span className="h-px flex-1 bg-gradient-to-r from-[#3DC1C5]/50 via-[#D1A246]/40 to-[#F2E04E]/60" />
              <span className="text-[#F2E04E]/70">06 STEPS</span>
              <span className="h-px flex-1 bg-gradient-to-r from-[#F2E04E]/40 via-[#D1A246]/30 to-transparent" />
              <span>IMPACT</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
