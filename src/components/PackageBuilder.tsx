"use client";

import { useMemo } from "react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { ArrowUpRight, Check, Plus, WhatsApp } from "@/components/ui/Icons";
import { Equalizer } from "@/components/ui/Section";
import { useQuote } from "@/components/providers/QuoteProvider";
import { useSound } from "@/components/providers/SoundProvider";
import { cn, scrollToSection, whatsappLink } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { useDict, useSettings } from "@/components/providers/SiteDataProvider";
import type { Locale } from "@content/model";

export function PackageBuilder({ locale }: { locale: Locale }) {
  const dict = useDict(locale);
  const settings = useSettings();
  const b = dict.packages.builder;
  const { quote, selectPackage, clearPackage, toggleProduction, setCampaign, reset } =
    useQuote();
  const { play } = useSound();

  const plan = dict.packages.plans.find((p) => p.number === quote.packageId) ?? null;
  const monthly = plan?.price ?? 0;

  const productionItems = useMemo(
    () =>
      dict.production.items.filter((item) =>
        quote.production.includes(item.number),
      ),
    [dict.production.items, quote.production],
  );

  const productionMin = productionItems.reduce((sum, item) => sum + item.price, 0);
  const campaignMin = quote.campaign ? settings.campaignMin : 0;
  const campaignMax = quote.campaign ? settings.campaignMax : 0;

  const onceMin = productionMin + campaignMin;
  const onceMax = productionMin + campaignMax;
  const totalMin = monthly + onceMin;
  const totalMax = monthly + onceMax;
  const isRange = totalMax > totalMin;
  const hasSelection = Boolean(plan) || productionItems.length > 0 || quote.campaign;
  const totalBasis =
    monthly > 0 && onceMin > 0
      ? `${b.monthly} + ${b.once}`
      : monthly > 0
        ? b.monthly
        : onceMin > 0
          ? b.once
          : "";

  const message = useMemo(() => {
    const m = locale === "ar" ? "مرحبًا ART ENERGY،" : "Hello ART ENERGY,";
    const intro =
      locale === "ar"
        ? "أرغب في الحصول على عرض سعر للاختيار التالي:"
        : "I would like a quote for the following selection:";
    const lines: string[] = [m, "", intro, ""];
    if (plan) {
      lines.push(
        `• ${plan.name} — ${plan.nickname}: ${formatNumber(plan.price, locale)} ${dict.ui.sar} / ${dict.packages.period}`,
      );
    }
    productionItems.forEach((item) => {
      lines.push(
        `• ${item.title}: ${dict.ui.from} ${formatNumber(item.price, locale)} ${dict.ui.sar}`,
      );
    });
    if (quote.campaign) {
      lines.push(
        `• ${b.campaignName}: ${formatNumber(settings.campaignMin, locale)} – ${formatNumber(settings.campaignMax, locale)} ${dict.ui.sar}`,
      );
    }
    if (hasSelection) {
      lines.push(
        "",
        `${b.total}: ${formatNumber(totalMin, locale)}${isRange ? ` – ${formatNumber(totalMax, locale)}` : ""} ${dict.ui.sar}${totalBasis ? ` (${totalBasis})` : ""}`,
      );
    } else {
      lines.push(
        "",
        locale === "ar"
          ? "أرغب في مناقشة مشروع جديد."
          : "I would like to discuss a new project.",
      );
    }
    return lines.join("\n");
  }, [
    locale,
    plan,
    productionItems,
    quote.campaign,
    b.campaignName,
    b.total,
    dict.ui.sar,
    dict.ui.from,
    dict.packages.period,
    totalMin,
    totalMax,
    isRange,
    hasSelection,
    totalBasis,
    settings.campaignMin,
    settings.campaignMax,
  ]);

  const togglePkg = (id: string, name: string) => {
    play("click");
    if (quote.packageId === id) clearPackage();
    else selectPackage(id, name);
  };

  return (
    <div className="overflow-hidden rounded-stage border border-line bg-card shadow-soft">
      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        <div className="p-6 sm:p-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold sm:text-3xl">{b.title}</h3>
              <p className="mt-3 max-w-lg text-sm leading-7 text-muted">
                {b.description}
              </p>
            </div>
            <Equalizer className="mt-1 hidden text-teal-600 sm:flex" bars={5} />
          </div>

          <div className="mt-8 space-y-8">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-sm font-bold">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0B2730] font-grotesk text-[9px] text-[#F2E04E]">
                    01
                  </span>
                  {b.step1}
                </h4>
                {plan && (
                  <button
                    type="button"
                    onClick={() => {
                      clearPackage();
                      play("click");
                    }}
                    className="text-[11px] text-muted underline-offset-4 hover:underline"
                  >
                    {dict.ui.remove}
                  </button>
                )}
              </div>

              <div className="mt-3 grid gap-2">
                {dict.packages.plans.map((p) => {
                  const active = quote.packageId === p.number;
                  return (
                    <button
                      key={p.number}
                      type="button"
                      onClick={() => togglePkg(p.number, p.name)}
                      aria-pressed={active}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-3.5 py-3 text-start transition",
                        active
                          ? "border-teal-500 bg-teal-500/10"
                          : "border-line hover:border-gold/60 hover:bg-surface",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                          active ? "border-teal-500 bg-teal-500 text-white" : "border-line-strong",
                        )}
                      >
                        {active && <Check size={10} />}
                      </span>
                      <span className="flex-1 text-[0.82rem] font-medium">
                        {p.name}
                        <span className="mx-1.5 text-muted">—</span>
                        <span className="text-muted">{p.nickname}</span>
                      </span>
                      <span className="shrink-0 font-grotesk text-xs font-semibold" dir="ltr">
                        {formatNumber(p.price, locale)}{" "}
                        <span className="text-[9px] font-normal text-muted">
                          {dict.ui.sar}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0B2730] font-grotesk text-[9px] text-[#F2E04E]">
                  02
                </span>
                {b.step2}
              </h4>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {dict.production.items.map((item) => {
                  const active = quote.production.includes(item.number);
                  return (
                    <button
                      key={item.number}
                      type="button"
                      onClick={() => {
                        toggleProduction(item.number, item.title);
                        play("click");
                      }}
                      aria-pressed={active}
                      className={cn(
                        "flex items-start justify-between gap-3 rounded-xl border px-3.5 py-3 text-start transition",
                        active
                          ? "border-gold-500 bg-gold-500/10"
                          : "border-line hover:border-gold/60 hover:bg-surface",
                      )}
                    >
                      <span className="flex gap-2">
                        <span
                          className={cn(
                            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                            active ? "border-gold-500 bg-gold-500 text-[#0B2730]" : "border-line-strong",
                          )}
                        >
                          {active ? <Check size={10} /> : <Plus size={9} />}
                        </span>
                        <span>
                          <span className="block text-[0.78rem] font-medium leading-5">
                            {item.title}
                          </span>
                          <span className="mt-0.5 block font-grotesk text-[9px] text-muted" dir="ltr">
                            {dict.ui.from} {formatNumber(item.price, locale)}{" "}
                            {dict.ui.sar}
                          </span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0B2730] font-grotesk text-[9px] text-[#F2E04E]">
                  03
                </span>
                {b.step3}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setCampaign(!quote.campaign);
                  play("click");
                }}
                aria-pressed={quote.campaign}
                className={cn(
                  "mt-3 flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3.5 text-start transition",
                  quote.campaign
                    ? "border-gold-500 bg-[#0B2730] text-[#F7F2E9]"
                    : "border-line hover:border-gold/60 hover:bg-surface",
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border",
                      quote.campaign
                        ? "border-[#F2E04E] bg-[#F2E04E] text-[#0B2730]"
                        : "border-line-strong",
                    )}
                  >
                    {quote.campaign && <Check size={11} />}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{b.campaignName}</span>
                    <span
                      className={cn(
                        "mt-0.5 block font-grotesk text-[9px]",
                        quote.campaign ? "text-[#F2E04E]/70" : "text-muted",
                      )}
                      dir="ltr"
                    >
                      {b.campaignHint}
                    </span>
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <aside className="relative flex flex-col justify-between overflow-hidden bg-[#0B2730] p-6 text-[#F7F2E9] sm:p-9">
          <div className="pointer-events-none absolute -end-20 -top-20 h-64 w-64 rounded-full bg-[#139CAA]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -start-16 h-64 w-64 rounded-full bg-[#D1A246]/15 blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-[9px] text-[#F2E04E]/80">{b.total}</span>
              <Equalizer className="text-[#3DC1C5]" />
            </div>

            <div
              className="mt-5 flex flex-wrap items-end gap-x-2 gap-y-1"
              aria-live="polite"
            >
              <AnimatedNumber
                value={totalMin}
                locale={locale}
                className="font-grotesk text-5xl font-semibold leading-none sm:text-6xl"
              />
              {isRange && (
                <>
                  <span className="font-grotesk text-2xl text-[#F2E04E]/60">–</span>
                  <AnimatedNumber
                    value={totalMax}
                    locale={locale}
                    className="font-grotesk text-3xl font-light leading-none text-[#F2E04E] sm:text-4xl"
                  />
                </>
              )}
              <span className="pb-1 text-sm text-white/60">{dict.ui.sar}</span>
            </div>
            {totalBasis && (
              <p className="mt-2 text-[10px] text-white/45">{totalBasis}</p>
            )}

            <div className="mt-7 space-y-2.5 border-t border-white/10 pt-5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-white/50">{b.step1}</span>
                <span className="flex items-center gap-1.5 font-grotesk">
                  {monthly > 0 ? (
                    <>
                      {formatNumber(monthly, locale)}
                      <span className="text-[9px] text-white/40">{dict.ui.sar}</span>
                    </>
                  ) : (
                    <span className="text-white/30">—</span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-white/50">{b.step2}</span>
                <span className="flex items-center gap-1.5 font-grotesk">
                  {productionMin > 0 ? (
                    <>
                      {formatNumber(productionMin, locale)}
                      <span className="text-[9px] text-white/40">{dict.ui.sar}</span>
                    </>
                  ) : (
                    <span className="text-white/30">—</span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-white/50">{b.campaignName}</span>
                <span className="flex items-center gap-1.5 font-grotesk">
                  {quote.campaign ? (
                    <span className="text-[#F2E04E]">
                      {formatNumber(settings.campaignMin, locale)} –{" "}
                      {formatNumber(settings.campaignMax, locale)}
                    </span>
                  ) : (
                    <span className="text-white/30">—</span>
                  )}
                </span>
              </div>
            </div>

            {!hasSelection && (
              <p className="mt-5 rounded-lg border border-dashed border-white/15 px-3 py-3 text-center text-[11px] text-white/40">
                {b.empty}
              </p>
            )}
          </div>

          <div className="relative mt-8">
            <a
              href={whatsappLink(message, settings.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => play("success")}
              className="btn btn-primary w-full"
            >
              <WhatsApp size={17} />
              {b.whatsapp}
            </a>
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="btn btn-ghost mt-2 w-full border-white/20 text-[#F7F2E9] hover:bg-white/10"
            >
              {b.useForm}
              <ArrowUpRight size={15} className="rtl:-scale-x-100" />
            </button>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <button
                type="button"
                onClick={() => {
                  reset();
                  play("click");
                }}
                className="shrink-0 text-[10px] text-white/40 underline-offset-4 transition hover:text-white hover:underline"
              >
                {b.reset}
              </button>
              <span className="text-end text-[9px] text-white/30">
                {dict.packages.note}
              </span>
            </div>
            <p className="mt-3 text-[9px] leading-4 text-white/30">{b.disclaimer}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
