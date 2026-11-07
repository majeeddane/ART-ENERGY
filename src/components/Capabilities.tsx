"use client";

import { SectionLabel } from "@/components/ui/Section";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Icon3D } from "@/components/ui/Icon3D";
import { Reveal } from "@/components/ui/Reveal";
import { cn, scrollToSection } from "@/lib/utils";
import { useDict } from "@/components/providers/SiteDataProvider";
import type { Locale } from "@content/model";

function OrbitStamp({ text, locale }: { text: string; locale: Locale }) {
  const pathId = `cap-orbit-${locale}`;
  return (
    <div className="relative h-40 w-40 shrink-0 sm:h-48 sm:w-48">
      <svg
        viewBox="0 0 140 140"
        className="h-full w-full motion-safe:animate-spin-slow"
        aria-hidden
      >
        <defs>
          <path
            id={pathId}
            d="M18.79 60.97 A52 52 0 0 1 121.21 60.97"
          />
        </defs>
        <circle
          cx="70"
          cy="70"
          r="65"
          fill="none"
          stroke="currentColor"
          strokeDasharray="1.5 4"
          className="text-gold/35"
        />
        <text
          className="fill-current text-[#8a6a25] dark:text-[#E8C97E]"
          fontFamily="var(--font-grotesk), system-ui, sans-serif"
          fontSize="7.2"
          letterSpacing="0.5"
          style={{ direction: "ltr" }}
        >
          <textPath
            href={`#${pathId}`}
            startOffset="50%"
            textAnchor="middle"
          >
            {text}
          </textPath>
        </text>
        <circle
          cx="70"
          cy="70"
          r="31"
          fill="none"
          strokeWidth="1"
          className="stroke-gold/55"
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-[#8a6a25] dark:text-[#E8C97E]">
        <Icon3D name="megaphone" size={30} />
        <span
          className="font-grotesk text-[6.2px] uppercase tracking-[0.2em]"
          dir="ltr"
        >
          STRATEGY / CREATIVE
        </span>
      </span>
      <Icon3D name="sparkles" size={20} className="absolute -end-1 top-2" />
    </div>
  );
}

export function Capabilities({ locale }: { locale: Locale }) {
  const dict = useDict(locale);
  const c = dict.capabilities;

  return (
    <section
      id="capabilities"
      className="relative overflow-hidden border-t border-line bg-canvas py-20 sm:py-28"
    >
      <div className="container relative">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <SectionLabel>{c.label}</SectionLabel>
            <Reveal>
              <h2 className="section-title mt-4 font-display">{c.title}</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-4 max-w-md text-sm leading-7 text-muted">
                {c.text}
              </p>
            </Reveal>
          </div>
          <div className="hidden sm:block">
            <OrbitStamp text={c.ringTop} locale={locale} />
          </div>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {c.groups.map((group, index) => (
            <Reveal
              key={group.number}
              delay={index * 0.08}
              className="h-full"
            >
              <article className="group flex h-full flex-col bg-card p-6 transition-colors duration-500 hover:bg-[#139CAA]/[0.045] dark:hover:bg-white/[0.04] sm:p-8">
                <div className="flex items-baseline justify-between">
                  <span className="font-grotesk text-[10px] tracking-[0.24em] text-gold-700">
                    {group.number}
                  </span>
                  <Icon3D
                    name="sparkles"
                    size={22}
                    className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-12"
                  />
                </div>
                <h3 className="mt-7 text-2xl font-bold leading-tight">
                  {group.title}
                </h3>
                <p className="mt-4 text-[12.5px] leading-7 text-muted">
                  {group.items.map((item, i) => (
                    <span key={item}>
                      {i > 0 && (
                        <span
                          aria-hidden
                          className="px-1.5 font-grotesk text-[10px] text-gold/70"
                        >
                          {"//"}
                        </span>
                      )}
                      {item}
                    </span>
                  ))}
                </p>
                <span className="mt-auto block h-px w-full bg-gradient-to-r from-line to-transparent" />
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => scrollToSection("services")}
            className={cn(
              "group inline-flex items-center gap-2 border-b border-line pb-1.5 text-xs font-semibold text-foreground transition hover:border-gold hover:text-gold-500",
            )}
          >
            {c.link}
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
