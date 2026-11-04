"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TiltCard } from "@/components/ui/TiltCard";
import { PackageBuilder } from "@/components/PackageBuilder";
import { SectionLabel } from "@/components/ui/Section";
import { ArrowUpRight, Check, Sparkle } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { useQuote } from "@/components/providers/QuoteProvider";
import { useSound } from "@/components/providers/SoundProvider";
import { cn, scrollToSection } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { useDict } from "@/components/providers/SiteDataProvider";
import type { Locale } from "@content/model";

export function Packages({ locale }: { locale: Locale }) {
  const dict = useDict(locale);
  const [tab, setTab] = useState<"ready" | "builder">("ready");
  const { selectPackage, quote } = useQuote();
  const { play } = useSound();

  const choose = (id: string, name: string) => {
    selectPackage(id, name);
    play("success");
    scrollToSection("contact");
  };

  const customise = (id: string, name: string) => {
    selectPackage(id, name);
    play("click");
    setTab("builder");
    window.setTimeout(() => {
      const el = document.getElementById("builder-panel");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  return (
    <section id="packages" className="relative overflow-hidden bg-canvas py-24 sm:py-32">
      <div className="pointer-events-none absolute -start-32 top-24 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -end-24 bottom-10 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />

      <div className="container relative">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <SectionLabel>{dict.packages.label}</SectionLabel>
            <Reveal>
              <h2 className="section-title mt-5 max-w-2xl font-display">
                {dict.packages.title}
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-4 max-w-lg text-sm leading-7 text-muted">
                {dict.packages.note}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="inline-flex rounded-full border border-line bg-card p-1" role="tablist">
              {(
                [
                  ["ready", dict.packages.tabReady],
                  ["builder", dict.packages.tabBuilder],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={tab === key}
                  onClick={() => {
                    setTab(key);
                    play("click");
                  }}
                  className={cn(
                    "relative rounded-full px-4 py-2.5 text-xs font-semibold transition sm:px-5",
                    tab === key
                      ? "bg-[var(--deep)] text-[#F2E04E]"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-12">
          <AnimatePresence mode="wait" initial={false}>
            {tab === "ready" ? (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                role="tabpanel"
              >
                <div className="grid gap-5 md:grid-cols-3">
                  {dict.packages.plans.map((plan, i) => {
                    const featured = i === 1;
                    const selected = quote.packageId === plan.number;
                    return (
                      <Reveal key={plan.number} delay={i * 0.08}>
                        <TiltCard
                          max={6}
                          innerClassName={cn(
                            "flex flex-col p-6 transition-colors duration-500 sm:p-7",
                            featured
                              ? "border border-gold/40 bg-[var(--night-2)] text-[#F7F2E9] shadow-gold"
                              : "border border-line bg-card text-foreground shadow-soft hover:border-gold/50 hover:shadow-soft-hover",
                            selected && "ring-2 ring-teal-500 ring-offset-2 ring-offset-canvas",
                          )}
                        >
                          {featured && (
                            <span
                              aria-hidden
                              className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,transparent_4%,rgba(242,224,78,0.95)_28%,rgba(209,162,70,0.95)_72%,transparent_96%)]"
                            />
                          )}
                          <div className="flex items-start justify-between">
                            <span
                              className={cn(
                                "flex h-12 w-12 items-center justify-center rounded-full border font-grotesk text-sm",
                                featured
                                  ? "border-[#F2E04E]/40 bg-[#F2E04E] text-[#0B2730]"
                                  : "border-gold/40 text-gold-700",
                              )}
                            >
                              {plan.number}
                            </span>
                            <span
                              className={cn(
                                "eyebrow text-[8px]",
                                featured ? "text-[#F2E04E]/70" : "text-muted",
                              )}
                            >
                              {dict.packages.period}
                            </span>
                          </div>

                          <div className="mt-7">
                            <p
                              className={cn(
                                "text-[11px] font-medium",
                                featured ? "text-white/50" : "text-muted",
                              )}
                            >
                              {plan.name}
                            </p>
                            <h3 className="mt-1 text-2xl font-bold sm:text-[1.7rem]">
                              {plan.nickname}
                            </h3>
                          </div>

                          <div className="mt-5 flex flex-wrap items-end gap-x-2">
                            <span className="font-grotesk text-[2.7rem] font-semibold leading-none">
                              {formatNumber(plan.price, locale)}
                            </span>
                            <span
                              className={cn(
                                "pb-1 text-xs",
                                featured ? "text-white/55" : "text-muted",
                              )}
                            >
                              {dict.ui.sar} / {dict.packages.period}
                            </span>
                          </div>

                          <div
                            className={cn(
                              "my-6 h-px w-full",
                              featured
                                ? "bg-gradient-to-r from-[#F2E04E]/50 to-transparent"
                                : "bg-line",
                            )}
                          />

                          <ul className="flex-1 space-y-2.5">
                            {plan.features.map((feature) => (
                              <li
                                key={feature}
                                className={cn(
                                  "flex items-start gap-2 text-[0.82rem] leading-6",
                                  featured ? "text-white/75" : "text-foreground/80",
                                )}
                              >
                                <span
                                  className={cn(
                                    "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                                    featured
                                      ? "bg-[#F2E04E]/15 text-[#F2E04E]"
                                      : "bg-gold/15 text-gold-700",
                                  )}
                                >
                                  <Check size={9} />
                                </span>
                                {feature}
                              </li>
                            ))}
                          </ul>

                          <div className="mt-7 space-y-2">
                            <button
                              type="button"
                              onClick={() => choose(plan.number, plan.name)}
                              onMouseEnter={() => play("hover")}
                              className={cn(
                                "btn w-full text-[0.82rem]",
                                featured
                                  ? "bg-[#F2E04E] text-[#0B2730] hover:bg-[#e6d33f]"
                                  : "btn-primary",
                              )}
                            >
                              {dict.packages.cta}
                              <ArrowUpRight size={15} className="rtl:-scale-x-100" />
                            </button>
                            <button
                              type="button"
                              onClick={() => customise(plan.number, plan.name)}
                              className={cn(
                                "flex w-full items-center justify-center gap-1.5 rounded-full py-1.5 text-[10px] transition",
                                featured
                                  ? "text-white/40 hover:text-[#F2E04E]"
                                  : "text-muted hover:text-foreground",
                              )}
                            >
                              <Sparkle size={11} />
                              {dict.packages.tabBuilder}
                            </button>
                          </div>

                        </TiltCard>
                      </Reveal>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="builder"
                id="builder-panel"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                role="tabpanel"
                className="scroll-mt-28"
              >
                <PackageBuilder locale={locale} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
