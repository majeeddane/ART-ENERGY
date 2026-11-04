"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { previews } from "@/components/ServicePreviews";
import { SectionLabel } from "@/components/ui/Section";
import { ArrowUpRight, Check } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { useQuote } from "@/components/providers/QuoteProvider";
import { useSound } from "@/components/providers/SoundProvider";
import { cn, scrollToSection } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { useDict } from "@/components/providers/SiteDataProvider";
import type { Locale } from "@content/model";

export function Services({ locale }: { locale: Locale }) {
  const dict = useDict(locale);
  const { setServiceFocus } = useQuote();
  const { play } = useSound();
  const reduced = useReducedMotionSafe();
  const pinRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const pin = viewportRef.current;
      const track = trackRef.current;
      if (!pin || !track) return;

      const amount = () => {
        const panel = track.querySelector<HTMLElement>(".service-panel");
        if (!panel) return 0;
        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
        return (
          (dict.services.items.length - 1) * (panel.offsetWidth + gap)
        );
      };
      const isRtl = document.documentElement.dir === "rtl";

      const tween = gsap.to(track, {
        x: () => (isRtl ? amount() : -amount()),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${amount() + window.innerHeight * 0.3}`,
          pin: true,
          scrub: 0.8,
          snap: {
            snapTo: 1 / (dict.services.items.length - 1),
            duration: { min: 0.2, max: 0.6 },
            delay: 0.08,
            ease: "power2.inOut",
          },
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
            const idx = Math.min(
              dict.services.items.length - 1,
              Math.round(self.progress * (dict.services.items.length - 1)),
            );
            setActive((prev) => (prev === idx ? prev : idx));
          },
        },
      });

      stRef.current = tween.scrollTrigger ?? null;
      ScrollTrigger.refresh();

      return () => {
        stRef.current = null;
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: "x" });
      };
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 700);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      mm.revert();
    };
  }, [reduced, dict.services.items.length]);

  const jumpTo = (i: number) => {
    play("click");
    const st = stRef.current;
    if (st) {
      const target = st.start + (st.end - st.start) * (i / (dict.services.items.length - 1));
      const lenis = (window as unknown as { __lenis?: { scrollTo: (n: number, o?: object) => void } }).__lenis;
      if (lenis) lenis.scrollTo(target + 2, { duration: 1.2 });
      else window.scrollTo({ top: target + 2, behavior: "smooth" });
    } else {
      document
        .getElementById(`service-${i}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const requestService = (title: string) => {
    setServiceFocus(title);
    scrollToSection("contact");
  };

  return (
    <section id="services" ref={pinRef} className="relative bg-surface">
      <div className="container pb-12 pt-24 sm:pt-32">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <SectionLabel>{dict.services.label}</SectionLabel>
            <Reveal>
              <h2 className="section-title mt-5 max-w-3xl font-display">
                {dict.services.title}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="shrink-0">
            <p className="max-w-xs text-sm leading-7 text-muted">
              <span className="hidden lg:inline">{dict.services.hint}</span>
              <span className="lg:hidden">{dict.services.hintMobile}</span>
            </p>
            <div className="mt-5 flex items-center gap-4">
              <span className="font-grotesk text-4xl font-light text-gold-500" dir="ltr">
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-12 bg-line" />
              <span className="font-grotesk text-sm text-muted" dir="ltr">
                {formatNumber(dict.services.items.length, locale).padStart(2, "0")}
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      <div ref={viewportRef} className="relative lg:h-[100svh] lg:overflow-hidden">
        <div className="px-4 pb-16 sm:px-6 lg:h-full lg:px-0 lg:pb-0">
          <div
            ref={trackRef}
            className="service-track flex flex-col gap-6 lg:h-full lg:flex-row lg:items-center lg:gap-8"
          >
            {dict.services.items.map((service, i) => {
              const Preview = previews[i];
              return (
                <article
                  key={service.number}
                  id={`service-${i}`}
                  className="service-panel shrink-0"
                  aria-labelledby={`service-title-${i}`}
                >
                  <div className="grid min-h-[68vh] overflow-hidden rounded-panel border border-line bg-card shadow-soft transition-shadow duration-500 hover:shadow-soft-hover lg:min-h-[72vh] lg:grid-cols-[1.02fr_0.98fr]">
                    <div className="flex flex-col justify-between p-6 sm:p-9 lg:p-10">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-grotesk text-[11px] tracking-[0.24em] text-gold-700">
                            {service.number} / {String(dict.services.items.length).padStart(2, "0")}
                          </span>
                          <span className="eyebrow text-[9px] text-muted">
                            {dict.services.label}
                          </span>
                        </div>

                        <h3
                          id={`service-title-${i}`}
                          className="mt-7 max-w-md text-balance text-3xl font-bold leading-[1.15] sm:text-4xl lg:text-[2.75rem]"
                        >
                          {service.title}
                        </h3>
                        <p className="mt-3 max-w-md text-base font-medium text-teal-600 dark:text-teal-300">
                          {service.tagline}
                        </p>

                        <div className="mt-7">
                          <span className="eyebrow text-[9px] text-muted">
                            {dict.ui.services}
                          </span>
                          <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                            {service.items.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-2 text-[0.83rem] leading-6 text-foreground/80"
                              >
                                <Check
                                  size={12}
                                  className="mt-1.5 shrink-0 text-gold-700"
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-5">
                        <button
                          type="button"
                          onClick={() => requestService(service.title)}
                          className="group inline-flex items-center gap-2 text-sm font-semibold transition hover:text-teal-600"
                        >
                          {dict.packages.cta}
                          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line transition group-hover:border-teal-500 group-hover:bg-teal-500 group-hover:text-white">
                            <ArrowUpRight size={14} className="rtl:-scale-x-100" />
                          </span>
                        </button>
                        <span className="font-grotesk text-[45px] font-light leading-none text-foreground/10 sm:text-[60px]">
                          {service.number}
                        </span>
                      </div>
                    </div>

                    <div className="relative min-h-[340px] p-3 sm:p-4 lg:min-h-0 lg:p-5">
                      <div
                        className="h-full"
                        data-cursor={i === 3 ? "play" : "discover"}
                      >
                        <Preview />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* pinned HUD */}
        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 hidden lg:block">
          <div className="container flex items-end justify-between">
            <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-line bg-canvas/85 px-2.5 py-2 backdrop-blur">
              {dict.services.items.map((s, i) => (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-label={`${String(i + 1).padStart(2, "0")} — ${s.title}`}
                  aria-current={active === i}
                  className={cn(
                    "flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 font-grotesk text-[9px] transition",
                    active === i
                      ? "bg-[#0B2730] text-[#F2E04E]"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}
            </div>
            <div className="pointer-events-none w-40">
              <div className="h-px w-full bg-line">
                <div
                  ref={progressRef}
                  className="h-px origin-left bg-gold-500 rtl:origin-right"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>
              <div className="mt-2 flex justify-between font-grotesk text-[8px] tracking-[0.2em] text-muted">
                <span dir="ltr">SCROLL</span>
                <span dir="ltr">HORIZONTAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
