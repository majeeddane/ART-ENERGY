import { NextResponse } from "next/server";
import { readSiteData } from "@/lib/store";

export const runtime = "nodejs";

type QuoteLine = {
  label?: string;
  price?: number;
  priceMax?: number;
  suffix?: string;
};

type Body = {
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  message?: string;
  website?: string;
  locale?: string;
  quote?: QuoteLine[];
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 6;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function clean(value: unknown, max = 4000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function quoteLines(quote: unknown) {
  if (!Array.isArray(quote)) return "";
  return quote
    .slice(0, 20)
    .map((item: QuoteLine) => {
      const label = clean(item?.label, 160);
      if (!label) return "";
      const price =
        typeof item?.price === "number"
          ? `${item.price}${
              typeof item?.priceMax === "number" ? ` – ${item.priceMax}` : ""
            } SAR`
          : "";
      return `• ${label}${price ? ` — ${price}` : ""} ${
        clean(item?.suffix, 40)
      }`.trim();
    })
    .filter(Boolean)
    .join("\n");
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: pretend success for bots.
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 160);
  const service = clean(body.service, 160);
  const message = clean(body.message, 4000);
  const locale = body.locale === "en" ? "en" : "ar";

  if (!name || !phone || !email || !service || !message) {
    return NextResponse.json(
      { ok: false, error: "missing_fields" },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const settings = (await readSiteData()).settings;
  const selections = quoteLines(body.quote);
  const subject =
    locale === "ar"
      ? `طلب مشروع — ${name} — ART ENERGY`
      : `Project request — ${name} — ART ENERGY`;

  const text = [
    `Name: ${name}`,
    `Phone / WhatsApp: ${phone}`,
    `Email: ${email}`,
    `Service: ${service}`,
    `Language: ${locale}`,
    "",
    "Message:",
    message,
    selections ? "\nSelection:" : "",
    selections,
  ]
    .filter(Boolean)
    .join("\n");

  // 1) Formspree (simplest, no server credentials)
  const formspree = process.env.FORMSPREE_ENDPOINT;
  if (formspree) {
    try {
      const res = await fetch(formspree, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          service,
          message,
          selection: selections,
          _replyto: email,
          _subject: subject,
        }),
      });
      if (res.ok) return NextResponse.json({ ok: true, via: "formspree" });
    } catch {
      /* fall through to next provider */
    }
  }

  // 2) Resend (server-side email)
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const from =
      process.env.CONTACT_FROM_EMAIL || "ART ENERGY <onboarding@resend.dev>";
    const to = process.env.CONTACT_TO_EMAIL || settings.email;
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject,
          text,
        }),
      });
      if (res.ok) return NextResponse.json({ ok: true, via: "resend" });
    } catch {
      /* fall through */
    }
  }

  // 3) Generic webhook
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          service,
          message,
          selection: selections,
          locale,
          subject,
        }),
      });
      if (res.ok) return NextResponse.json({ ok: true, via: "webhook" });
    } catch {
      /* fall through */
    }
  }

  // Nothing configured yet. The UI offers WhatsApp / email as a one-click fallback.
  return NextResponse.json(
    {
      ok: false,
      fallback: true,
      error: "not_configured",
      message:
        "No email provider is configured. Set FORMSPREE_ENDPOINT or RESEND_API_KEY.",
    },
    { status: 503 },
  );
}
