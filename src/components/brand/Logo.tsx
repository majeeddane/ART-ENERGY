import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

type MarkProps = SVGProps<SVGSVGElement> & {
  /** Unique gradient id prefix when several marks are on the page. */
  idPrefix?: string;
  title?: string;
};

/**
 * ART ENERGY mark — a broadcast megaphone on a night-teal tile.
 * Drawn as crisp vector artwork so it stays sharp on light, dark and
 * transparent surfaces without a white box behind it.
 */
export function BrandMark({
  className,
  idPrefix = "ae",
  title,
  ...props
}: MarkProps) {
  const tile = `${idPrefix}-tile`;
  const glow = `${idPrefix}-glow`;
  const sheen = `${idPrefix}-sheen`;
  const arc = `${idPrefix}-arc`;

  return (
    <svg
      viewBox="0 0 240 240"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={cn("block", className)}
      {...props}
    >
      <defs>
        <linearGradient
          id={tile}
          x1="26"
          y1="18"
          x2="216"
          y2="228"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#17A8B6" />
          <stop offset="0.48" stopColor="#0E6D79" />
          <stop offset="1" stopColor="#07262F" />
        </linearGradient>
        <linearGradient
          id={glow}
          x1="46"
          y1="66"
          x2="196"
          y2="176"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FBEF9A" />
          <stop offset="0.5" stopColor="#F2E04E" />
          <stop offset="1" stopColor="#D1A246" />
        </linearGradient>
        <radialGradient id={sheen} cx="0.28" cy="0.14" r="0.9">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.34" />
          <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={arc} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F2E04E" stopOpacity="0.7" />
          <stop offset="1" stopColor="#3DC1C5" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* tile */}
      <rect width="240" height="240" rx="56" fill={`url(#${tile})`} />
      <rect width="240" height="240" rx="56" fill={`url(#${sheen})`} />
      <rect
        x="1.25"
        y="1.25"
        width="237.5"
        height="237.5"
        rx="54.75"
        fill="none"
        stroke="#F2E04E"
        strokeOpacity="0.28"
        strokeWidth="2.5"
      />

      {/* broadcast orbit */}
      <circle
        cx="120"
        cy="120"
        r="80"
        fill="none"
        stroke={`url(#${arc})`}
        strokeWidth="1.5"
        strokeDasharray="2 10"
        strokeLinecap="round"
      />

      {/* megaphone */}
      <g
        transform="translate(20 20) scale(8.3)"
        fill="none"
        stroke={`url(#${glow})`}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m3 11 18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </g>

      {/* signal accents */}
      <g fill="#F2E04E">
        <circle cx="206" cy="86" r="4.2" />
        <circle cx="216" cy="108" r="2.8" opacity="0.72" />
        <circle cx="200" cy="150" r="2.2" opacity="0.5" />
      </g>
    </svg>
  );
}

export function Wordmark({
  className,
  markClassName,
  compact = false,
  tone = "auto",
  idPrefix = "ae-wordmark",
  logoSrc,
}: {
  className?: string;
  markClassName?: string;
  compact?: boolean;
  tone?: "auto" | "light";
  idPrefix?: string;
  logoSrc?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-3", className)}
      aria-label="ART ENERGY — Advertising, marketing and media production"
    >
      {logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoSrc}
          alt="ART ENERGY"
          className={cn("h-11 w-11 shrink-0 object-contain", markClassName)}
        />
      ) : (
        <BrandMark
          idPrefix={idPrefix}
          className={cn("h-11 w-11 shrink-0", markClassName)}
        />
      )}
      {!compact && (
        <span className="flex flex-col justify-center">
          <span
            className={cn(
              "font-grotesk text-[15px] font-semibold leading-none tracking-[0.18em]",
              tone === "light" ? "text-[#F7F2E9]" : "text-foreground",
            )}
            dir="ltr"
          >
            ART ENERGY
          </span>
          <span
            className={cn(
              "mt-1.5 font-grotesk text-[7.5px] uppercase leading-none tracking-[0.16em]",
              tone === "light" ? "text-[#F7F2E9]/60" : "text-muted",
            )}
            dir="ltr"
          >
            Advertising · Marketing · Media
          </span>
        </span>
      )}
    </span>
  );
}
