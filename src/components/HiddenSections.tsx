"use client";

import { SectionLabel } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowUpRight } from "@/components/ui/Icons";
import {
  useDict,
  useFlags,
  useSiteData,
} from "@/components/providers/SiteDataProvider";
import type { Locale } from "@content/model";
import type {
  ClientItem,
  JournalItem,
  TeamItem,
  WorkItem,
} from "@content/model";

function pick(locale: Locale, ar: string, en: string) {
  return locale === "ar" ? ar || en : en || ar;
}

function Head({
  label,
  title,
  text,
  tone,
}: {
  label: string;
  title: string;
  text: string;
  tone: "light" | "dark";
}) {
  return (
    <>
      <SectionLabel tone={tone === "dark" ? "light" : "dark"}>
        {label}
      </SectionLabel>
      <Reveal>
        <h2 className="section-title mt-4 max-w-2xl font-display">{title}</h2>
      </Reveal>
      <p
        className={
          tone === "dark"
            ? "mt-3 max-w-lg text-sm text-white/55"
            : "mt-3 max-w-lg text-sm text-muted"
        }
      >
        {text}
      </p>
    </>
  );
}

function Placeholder({
  id,
  label,
  title,
  text,
  tone = "light",
}: {
  id: string;
  label: string;
  title: string;
  text: string;
  tone?: "light" | "dark";
}) {
  return (
    <section
      id={id}
      className={
        tone === "dark"
          ? "on-dark border-y border-white/10 bg-[#0B2730] py-20 text-[#F7F2E9]"
          : "border-y border-line bg-surface py-20 text-foreground"
      }
    >
      <div className="container">
        <Head label={label} title={title} text={text} tone={tone} />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={
                tone === "dark"
                  ? "rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-5"
                  : "rounded-2xl border border-dashed border-line bg-card p-5"
              }
            >
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-teal-500/15 via-gold/10 to-transparent" />
              <div className="mt-4 space-y-2">
                <span className="block h-2 w-2/3 rounded-full bg-current opacity-10" />
                <span className="block h-1.5 w-1/2 rounded-full bg-current opacity-[0.07]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkCard({
  item,
  locale,
}: {
  item: WorkItem;
  locale: Locale;
}) {
  const title = pick(locale, item.titleAr, item.titleEn);
  const category = pick(locale, item.categoryAr, item.categoryEn);
  const description = pick(locale, item.descriptionAr, item.descriptionEn);
  const body = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/15 via-gold/10 to-transparent">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-grotesk text-[10px] tracking-[0.24em] text-muted">
            ART ENERGY / WORK
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-[#04181E]/85 to-transparent p-4 text-[#F7F2E9]">
          <span className="text-[11px] font-medium">{category}</span>
          <span className="font-grotesk text-[10px] text-white/60" dir="ltr">
            {item.year}
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold leading-snug transition group-hover:text-teal-600">
            {title}
          </h3>
          {description && (
            <p className="mt-2 line-clamp-2 text-sm leading-7 text-muted">
              {description}
            </p>
          )}
        </div>
        {item.href && (
          <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line transition group-hover:border-teal-500 group-hover:bg-teal-500 group-hover:text-white">
            <ArrowUpRight size={14} className="rtl:-scale-x-100" />
          </span>
        )}
      </div>
    </>
  );

  return item.href ? (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      {body}
    </a>
  ) : (
    <article className="group">{body}</article>
  );
}

function ClientCard({ item }: { item: ClientItem }) {
  const card = (
    <div className="flex h-32 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-gold/40 hover:bg-white/[0.06]">
      {item.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.logo}
          alt={item.name}
          loading="lazy"
          decoding="async"
          className="max-h-14 max-w-[80%] object-contain opacity-80 transition hover:opacity-100"
        />
      ) : (
        <span className="font-display text-2xl text-[#F2E04E]/80">
          {item.name}
        </span>
      )}
    </div>
  );

  return item.url ? (
    <a href={item.url} target="_blank" rel="noopener noreferrer">
      {card}
    </a>
  ) : (
    card
  );
}

function TeamCard({ item, locale }: { item: TeamItem; locale: Locale }) {
  const name = pick(locale, item.nameAr, item.nameEn);
  const role = pick(locale, item.roleAr, item.roleEn);
  const bio = pick(locale, item.bioAr, item.bioEn);
  return (
    <article className="group overflow-hidden rounded-2xl border border-line bg-card">
      <div className="relative aspect-[4/5] bg-gradient-to-br from-teal-500/15 via-gold/10 to-transparent">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-grotesk text-[10px] tracking-[0.24em] text-muted">
            {name || "ART ENERGY"}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold">{name}</h3>
        {role && (
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-gold-700">
            {role}
          </p>
        )}
        {bio && <p className="mt-3 text-sm leading-7 text-muted">{bio}</p>}
      </div>
    </article>
  );
}

function JournalRow({ item, locale }: { item: JournalItem; locale: Locale }) {
  const title = pick(locale, item.titleAr, item.titleEn);
  const excerpt = pick(locale, item.excerptAr, item.excerptEn);
  const body = (
    <div className="grid gap-5 border-b border-white/10 py-7 sm:grid-cols-[140px_1fr] sm:gap-8">
      <div>
        <span className="font-grotesk text-[10px] tracking-[0.2em] text-[#F2E04E]/70" dir="ltr">
          {item.date}
        </span>
      </div>
      <div>
        <h3 className="text-xl font-bold transition group-hover:text-[#F2E04E] sm:text-2xl">
          {title}
        </h3>
        {excerpt && (
          <p className="mt-2 max-w-2xl text-sm leading-7 text-white/55">
            {excerpt}
          </p>
        )}
        {item.href && (
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#F2E04E]/80">
            {locale === "ar" ? "اقرأ المزيد" : "Read more"}
            <ArrowUpRight size={13} className="rtl:-scale-x-100" />
          </span>
        )}
      </div>
    </div>
  );

  return item.href ? (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      {body}
    </a>
  ) : (
    <article className="group">{body}</article>
  );
}

/**
 * Sections that are hidden by default and filled from the dashboard.
 * If a section is enabled but has no entries, a tasteful placeholder is shown.
 */
export function HiddenSections({ locale }: { locale: Locale }) {
  const dict = useDict(locale);
  const flags = useFlags();
  const { hidden } = useSiteData();

  return (
    <>
      {flags.work &&
        (hidden.work.length > 0 ? (
          <section
            id="work"
            className="border-y border-line bg-surface py-20 text-foreground sm:py-24"
          >
            <div className="container">
              <Head
                label={dict.hidden.work.label}
                title={dict.hidden.work.title}
                text={dict.hidden.work.text}
                tone="light"
              />
              <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2">
                {hidden.work.map((item, index) => (
                  <Reveal key={item.id} delay={index * 0.05}>
                    <WorkCard item={item} locale={locale} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <Placeholder
            id="work"
            label={dict.hidden.work.label}
            title={dict.hidden.work.title}
            text={dict.hidden.work.text}
          />
        ))}

      {flags.clients &&
        (hidden.clients.length > 0 ? (
          <section
            id="clients"
            className="on-dark border-y border-white/10 bg-[#0B2730] py-20 text-[#F7F2E9] sm:py-24"
          >
            <div className="container">
              <Head
                label={dict.hidden.clients.label}
                title={dict.hidden.clients.title}
                text={dict.hidden.clients.text}
                tone="dark"
              />
              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {hidden.clients.map((item, index) => (
                  <Reveal key={item.id} delay={index * 0.04}>
                    <ClientCard item={item} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <Placeholder
            id="clients"
            label={dict.hidden.clients.label}
            title={dict.hidden.clients.title}
            text={dict.hidden.clients.text}
            tone="dark"
          />
        ))}

      {flags.team &&
        (hidden.team.length > 0 ? (
          <section
            id="team"
            className="border-y border-line bg-canvas py-20 text-foreground sm:py-24"
          >
            <div className="container">
              <Head
                label={dict.hidden.team.label}
                title={dict.hidden.team.title}
                text={dict.hidden.team.text}
                tone="light"
              />
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {hidden.team.map((item, index) => (
                  <Reveal key={item.id} delay={index * 0.05}>
                    <TeamCard item={item} locale={locale} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <Placeholder
            id="team"
            label={dict.hidden.team.label}
            title={dict.hidden.team.title}
            text={dict.hidden.team.text}
          />
        ))}

      {flags.journal &&
        (hidden.journal.length > 0 ? (
          <section
            id="journal"
            className="on-dark border-y border-white/10 bg-[#07262F] py-20 text-[#F7F2E9] sm:py-24"
          >
            <div className="container">
              <Head
                label={dict.hidden.journal.label}
                title={dict.hidden.journal.title}
                text={dict.hidden.journal.text}
                tone="dark"
              />
              <div className="mt-8">
                {hidden.journal.map((item, index) => (
                  <Reveal key={item.id} delay={index * 0.04}>
                    <JournalRow item={item} locale={locale} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <Placeholder
            id="journal"
            label={dict.hidden.journal.label}
            title={dict.hidden.journal.title}
            text={dict.hidden.journal.text}
            tone="dark"
          />
        ))}
    </>
  );
}
