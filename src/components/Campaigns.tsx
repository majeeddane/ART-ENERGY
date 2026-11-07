"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/Section";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Icon3D } from "@/components/ui/Icon3D";
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
                <div className="mt-2 flex items-baseline gap-2" dir="ltr">
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
                <Icon3D name="megaphone" size={22} />
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

          <div className="relative mx-auto w-full max-w-[520px]">
            <motion.div
              className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_50px_120px_-60px_rgba(0,0,0,0.9)]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <Image
                src="/images/photos/campaign.webp"
                alt={dict.campaigns.label}
                fill
                sizes="(min-width: 1024px) 520px, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04181E] via-[#04181E]/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#07262F]/35 via-transparent to-transparent" />

              <div className="absolute start-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3DC1C5] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3DC1C5]" />
                </span>
                <span className="font-grotesk text-[9px] tracking-[0.24em] text-white/70" dir="ltr">
                  ON SET
                </span>
              </div>

              <div className="absolute end-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 backdrop-blur">
                <Icon3D name="clapper-board" size={18} />
                <span className="font-grotesk text-[9px] tracking-[0.24em] text-white/70" dir="ltr">
                  PRODUCTION
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="font-grotesk text-[8px] tracking-[0.26em] text-[#F2E04E]/75" dir="ltr">
                  CREATIVE MEDIA AGENCY
                </span>
              </div>
            </motion.div>

            <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
              {steps.map((step, i) => (
                <div key={step} className="flex items-start gap-2.5 bg-[#04181E]/85 px-4 py-3.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#D1A246]/50 bg-[#07262F] font-grotesk text-[8px] text-[#F2E04E]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[10.5px] leading-4 text-white/70 sm:text-[11.5px] sm:leading-5">
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-4 font-grotesk text-[9px] tracking-[0.22em] text-white/35" dir="ltr">
              <span>IDEA</span>
              <span className="h-px flex-1 bg-gradient-to-r from-[#3DC1C5]/50 via-[#D1A246]/40 to-[#F2E04E]/60" />
              <Icon3D name="rocket" size={18} />
              <span className="h-px flex-1 bg-gradient-to-r from-[#F2E04E]/40 via-[#D1A246]/30 to-transparent" />
              <span>IMPACT</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
