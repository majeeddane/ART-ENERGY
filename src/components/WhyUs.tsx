"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/Section";
import { Check, Note, Sparkle } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { useDict } from "@/components/providers/SiteDataProvider";
import type { Locale } from "@content/model";

export function WhyUs({ locale }: { locale: Locale }) {
  const dict = useDict(locale);

  return (
    <section id="why" className="relative overflow-hidden bg-canvas py-24 sm:py-32">
      <div className="pointer-events-none absolute -start-24 top-1/3 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="container relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <SectionLabel>{dict.why.label}</SectionLabel>
          <Reveal>
            <h2 className="section-title mt-5 max-w-lg font-display">
              {dict.why.title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="gold-text">
                {dict.why.title.split(" ").slice(-1)}
              </span>
            </h2>
          </Reveal>

          <div className="relative mt-12 hidden h-40 w-40 lg:block">
            <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-gold/40" />
            <div className="absolute inset-5 rounded-full bg-[var(--deep)] shadow-lift ring-1 ring-gold/30" />
            <div className="absolute inset-[3.25rem] flex items-center justify-center rounded-full bg-[#F2E04E] text-[#0B2730] shadow-gold">
              <Note size={24} />
            </div>
            <Sparkle className="absolute -end-3 top-2 text-gold-500" size={20} />
          </div>
        </div>

        <div>
          {dict.why.items.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.65, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group flex items-center gap-4 border-b border-line py-6 transition-colors first:border-t sm:gap-7 sm:py-7"
            >
              <span className="font-grotesk text-[10px] tracking-[0.2em] text-muted/60 transition group-hover:text-gold-700">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-xl font-semibold transition group-hover:translate-x-1 sm:text-2xl rtl:group-hover:-translate-x-1">
                {item}
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold-700 transition duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-[#0B2730]">
                <Check size={15} />
              </span>
            </motion.div>
          ))}
          <div className="mt-8 flex items-center gap-3 text-[9px] uppercase tracking-[0.22em] text-muted" dir="ltr">
            <span className="h-px w-8 bg-gold" />
            {String(dict.why.items.length).padStart(2, "0")} / REASONS
          </div>
        </div>
      </div>
    </section>
  );
}
