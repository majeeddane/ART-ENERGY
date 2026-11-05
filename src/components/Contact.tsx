"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/Section";
import { ChartColumn } from "@/components/ui/Icons";
import {
  ArrowUpRight,
  Check,
  Mail,
  Phone,
  Send,
  WhatsApp,
} from "@/components/ui/Icons";
import { useQuote } from "@/components/providers/QuoteProvider";
import { useSound } from "@/components/providers/SoundProvider";
import { cn, mailtoLink, whatsappLink } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { useDict, useSettings } from "@/components/providers/SiteDataProvider";
import type { Locale } from "@content/model";

type Status = "idle" | "sending" | "success" | "fallback" | "error";
type Field = "name" | "phone" | "email" | "service" | "message";

export function Contact({ locale }: { locale: Locale }) {
  const dict = useDict(locale);
  const settings = useSettings();
  const f = dict.contact.form;
  const { summary, serviceFocus, reset } = useQuote();
  const { play } = useSound();
  const successRef = useRef<HTMLHeadingElement>(null);

  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (serviceFocus) {
      setValues((v) => ({ ...v, service: serviceFocus }));
      setErrors((e) => ({ ...e, service: undefined }));
    }
  }, [serviceFocus]);

  useEffect(() => {
    if (status === "success" && successRef.current) {
      successRef.current.focus();
    }
  }, [status]);

  const set = (key: keyof typeof values, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (key !== "website") {
      setErrors((e) => ({ ...e, [key]: undefined }));
    }
  };

  const validate = () => {
    const e: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) e.name = f.errorRequired;
    if (!values.phone.trim()) e.phone = f.errorRequired;
    else if (!/^[+\d\s()-]{8,22}$/.test(values.phone.trim()))
      e.phone = f.errorPhone;
    if (!values.email.trim()) e.email = f.errorRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      e.email = f.errorEmail;
    if (!values.service) e.service = f.errorRequired;
    if (!values.message.trim()) e.message = f.errorRequired;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const messageText = useMemo(() => {
    const lines = [
      locale === "ar" ? "مرحبًا ART ENERGY،" : "Hello ART ENERGY,",
      "",
      `${f.name}: ${values.name || "—"}`,
      `${f.phone}: ${values.phone || "—"}`,
      `${f.email}: ${values.email || "—"}`,
      `${f.service}: ${values.service || "—"}`,
      "",
      `${f.message}: ${values.message || "—"}`,
    ];
    if (summary.length) {
      lines.push("", `${f.quoteTitle}:`);
      summary.forEach((s) => {
        const price =
          s.price !== undefined
            ? `${formatNumber(s.price, locale)}${s.priceMax ? ` – ${formatNumber(s.priceMax, locale)}` : ""} ${dict.ui.sar}`
            : "";
        lines.push(`• ${s.label} ${price ? `— ${price}` : ""} ${s.suffix ?? ""}`);
      });
    }
    return lines.join("\n");
  }, [values, summary, locale, f, dict.ui.sar]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      play("click");
      return;
    }
    if (values.website) {
      setStatus("success");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          quote: summary,
          locale,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        fallback?: boolean;
      };
      if (res.ok && data.ok) {
        setStatus("success");
        play("success");
      } else if (data.fallback) {
        setStatus("fallback");
        play("click");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const resetForm = () => {
    setValues({ name: "", phone: "", email: "", service: "", message: "", website: "" });
    setErrors({});
    setStatus("idle");
    reset();
  };

  const fieldClass = (field: Field) =>
    cn(
      "field",
      errors[field] && "border-[#b83a33] dark:border-[#ff9a92]",
    );

  return (
    <section
      id="contact"
      className="on-dark relative overflow-hidden bg-[var(--night-3)] py-24 text-[#F7F2E9] sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(61,193,197,0.18),transparent_45%)]" />
      <div className="pointer-events-none absolute -end-20 bottom-0 h-80 w-80 rounded-full bg-[#D1A246]/10 blur-3xl" />
      <div className="container relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionLabel tone="light">{dict.contact.label}</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="section-title mt-5 max-w-lg font-display"
          >
            {dict.contact.title}
          </motion.h2>
          <p className="mt-5 max-w-md text-sm leading-8 text-white/60 sm:text-base">
            {dict.contact.text}
          </p>

          <div className="mt-10 space-y-3">
            <a
              href={settings.phoneHref}
              className="group flex items-center gap-4 rounded-card border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:border-[#F2E04E]/40 hover:bg-white/[0.06]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#3DC1C5]/40 text-[#3DC1C5]">
                <Phone size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] uppercase tracking-[0.2em] text-white/40">
                  {dict.contact.phoneLabel}
                </span>
                <span className="mt-0.5 block font-grotesk text-lg font-medium" dir="ltr">
                  {settings.phoneDisplay}
                </span>
              </span>
              <ArrowUpRight
                size={16}
                className="shrink-0 text-white/30 transition group-hover:text-[#F2E04E] rtl:-scale-x-100"
              />
            </a>

            <a
              href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
                locale === "ar"
                  ? "مرحبًا ART ENERGY، أرغب في مناقشة مشروع."
                  : "Hello ART ENERGY, I would like to discuss a project.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-card border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:border-[#F2E04E]/40 hover:bg-white/[0.06]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#F28C28]/40 text-[#F28C28]">
                <WhatsApp size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] uppercase tracking-[0.2em] text-white/40">
                  {dict.ui.whatsapp}
                </span>
                <span className="mt-0.5 block font-grotesk text-lg font-medium" dir="ltr">
                  {settings.phoneDisplay}
                </span>
              </span>
              <ArrowUpRight
                size={16}
                className="shrink-0 text-white/30 transition group-hover:text-[#F2E04E] rtl:-scale-x-100"
              />
            </a>

            <a
              href={`mailto:${settings.email}`}
              className="group flex items-center gap-4 rounded-card border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:border-[#F2E04E]/40 hover:bg-white/[0.06]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D1A246]/40 text-[#D1A246]">
                <Mail size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] uppercase tracking-[0.2em] text-white/40">
                  {dict.contact.emailLabel}
                </span>
                <span className="mt-0.5 block truncate font-grotesk text-sm font-medium sm:text-base" dir="ltr">
                  {settings.email}
                </span>
              </span>
              <ArrowUpRight
                size={16}
                className="shrink-0 text-white/30 transition group-hover:text-[#F2E04E] rtl:-scale-x-100"
              />
            </a>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <ChartColumn size={15} className="text-[#F2E04E]" />
            <span className="font-grotesk text-[9px] uppercase tracking-[0.22em] text-white/35" dir="ltr">
              READY TO GROW
            </span>
          </div>
        </div>

        <div className="relative rounded-panel border border-white/15 bg-[#FBF8F1] p-5 text-[#0B2730] shadow-lift sm:p-8">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-10 top-0 h-[3px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(209,162,70,0.85),rgba(242,224,78,0.7),transparent)]"
          />
          <div className="pointer-events-none absolute -end-3 -top-3 h-16 w-16 rounded-full border border-[#D1A246]/40" />
          <div className="flex items-center justify-between">
            <span className="eyebrow text-[9px] text-[#0B2730]/70">
              {dict.contact.label}
            </span>
            <span className="font-grotesk text-[9px] tracking-[0.2em] text-[#0B2730]/70" dir="ltr">
              FORM / 01
            </span>
          </div>

          {summary.length > 0 && status !== "success" && (
            <div className="mt-4 rounded-xl border border-[#D1A246]/35 bg-[#D1A246]/10 p-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold">{f.quoteTitle}</span>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    play("click");
                  }}
                  className="text-[9px] text-[#0B2730]/70 underline-offset-2 hover:underline"
                >
                  {dict.packages.builder.reset}
                </button>
              </div>
              <ul className="mt-2 space-y-1">
                {summary.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-2 text-[10px]">
                    <span className="truncate">{item.label}</span>
                    <span className="shrink-0 font-grotesk text-[#0B2730]/70" dir="ltr">
                      {item.price !== undefined
                        ? `${formatNumber(item.price, locale)}${item.priceMax ? `–${formatNumber(item.priceMax, locale)}` : ""} ${dict.ui.sar}`
                        : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <AnimatePresence mode="wait" initial={false}>
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex min-h-[420px] flex-col items-center justify-center py-10 text-center"
              >
                <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="absolute inset-0 rounded-full border border-[#139CAA]/40"
                      animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        delay: i * 0.6,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#139CAA] text-white">
                    <Check size={28} />
                  </span>
                </div>
                <h3
                  ref={successRef}
                  tabIndex={-1}
                  className="text-3xl font-bold outline-none"
                >
                  {f.successTitle}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-[#0B2730]/75">
                  {f.successBody}
                </p>
                <a
                  href={whatsappLink(messageText, settings.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary mt-6"
                >
                  <WhatsApp size={17} />
                  {f.successWhatsApp}
                </a>
                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-4 text-xs text-[#0B2730]/70 underline-offset-4 hover:underline"
                >
                  {f.another}
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-5"
                noValidate
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1 flex items-center gap-1 text-[11px] font-semibold">
                      {f.name}
                      <span className="text-[#B8873A]">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      autoComplete="name"
                      className={fieldClass("name")}
                      placeholder={f.namePlaceholder}
                      value={values.name}
                      onChange={(e) => set("name", e.target.value)}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "err-name" : undefined}
                      required
                    />
                    {errors.name && (
                      <p id="err-name" className="field-error" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-1 flex items-center gap-1 text-[11px] font-semibold">
                      {f.phone}
                      <span className="text-[#B8873A]">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      dir="ltr"
                      className={cn(fieldClass("phone"), "text-start")}
                      placeholder={f.phonePlaceholder}
                      value={values.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? "err-phone" : undefined}
                      required
                    />
                    {errors.phone && (
                      <p id="err-phone" className="field-error" role="alert">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="mb-1 flex items-center gap-1 text-[11px] font-semibold">
                      {f.email}
                      <span className="text-[#B8873A]">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      dir="ltr"
                      className={cn(fieldClass("email"), "text-start")}
                      placeholder={f.emailPlaceholder}
                      value={values.email}
                      onChange={(e) => set("email", e.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "err-email" : undefined}
                      required
                    />
                    {errors.email && (
                      <p id="err-email" className="field-error" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <fieldset className="mt-6">
                  <legend className="mb-2 flex items-center gap-1 text-[11px] font-semibold">
                    {f.service}
                    <span className="text-[#B8873A]">*</span>
                  </legend>
                  <div className="flex flex-wrap gap-1.5">
                    {dict.services.items.map((service) => (
                      <button
                        key={service.number}
                        type="button"
                        onClick={() => set("service", service.title)}
                        aria-pressed={values.service === service.title}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-[10.5px] transition",
                          values.service === service.title
                            ? "border-[#139CAA] bg-[#139CAA] text-white"
                            : "border-[#0B2730]/15 text-[#0B2730]/65 hover:border-[#139CAA]/60",
                        )}
                      >
                        {service.title}
                      </button>
                    ))}
                  </div>
                  {errors.service && (
                    <p className="field-error" role="alert">
                      {errors.service}
                    </p>
                  )}
                </fieldset>

                <div className="mt-6">
                  <label htmlFor="message" className="mb-1 flex items-center gap-1 text-[11px] font-semibold">
                    {f.message}
                    <span className="text-[#B8873A]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className={cn(fieldClass("message"), "resize-none")}
                    placeholder={f.messagePlaceholder}
                    value={values.message}
                    onChange={(e) => set("message", e.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "err-message" : undefined}
                    required
                  />
                  {errors.message && (
                    <p id="err-message" className="field-error" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* honeypot */}
                <div className="absolute -left-[9999px] top-auto" aria-hidden>
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.website}
                    onChange={(e) => set("website", e.target.value)}
                  />
                </div>

                {(status === "fallback" || status === "error") && (
                  <div className="mt-5 rounded-xl border border-[#B8873A]/40 bg-[#D1A246]/10 p-4 text-xs leading-6">
                    <p className="font-semibold">
                      {status === "fallback" ? f.fallbackNote : f.errorGeneric}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={whatsappLink(messageText, settings.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#F28C28] px-3.5 py-2 text-[11px] font-bold text-[#1b1206]"
                      >
                        <WhatsApp size={14} />
                        {dict.contact.whatsappCta}
                      </a>
                      <a
                        href={mailtoLink(
                          locale === "ar" ? "طلب مشروع — ART ENERGY" : "Project request — ART ENERGY",
                          messageText,
                          settings.email,
                        )}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#0B2730]/20 px-3.5 py-2 text-[11px] font-semibold"
                      >
                        <Mail size={14} />
                        {dict.contact.emailCta}
                      </a>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn btn-primary min-w-[170px] disabled:cursor-wait disabled:opacity-60"
                  >
                    {status === "sending" ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1b1206]/30 border-t-[#1b1206]" />
                        {f.sending}
                      </>
                    ) : (
                      <>
                        {f.submit}
                        <Send size={16} className="rtl:-scale-x-100" />
                      </>
                    )}
                  </button>
                  <a
                    href={whatsappLink(messageText, settings.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#0B2730]/55 underline-offset-4 hover:underline"
                  >
                    <WhatsApp size={13} />
                    {dict.contact.whatsappCta}
                  </a>
                </div>
                <p className="mt-4 text-[9px] text-[#0B2730]/70">{f.privacy}</p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
