import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

type MarkProps = SVGProps<SVGSVGElement> & {
  /** Unique gradient id prefix when several marks are on the page. */
  idPrefix?: string;
  title?: string;
};

/**
 * ART ENERGY mark — a music note built from a vinyl record and a headphone.
 * Re-drawn as crisp vector artwork from the supplied brand logo so it works
 * on light, dark and transparent surfaces without a white box.
 */
export function BrandMark({
  className,
  idPrefix = "ae",
  title,
  ...props
}: MarkProps) {
  const teal = `${idPrefix}-teal`;
  const tealDeep = `${idPrefix}-teal-deep`;
  const gold = `${idPrefix}-gold`;
  const orange = `${idPrefix}-orange`;
  const disc = `${idPrefix}-disc`;
  const hole = `${idPrefix}-hole`;

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
        <linearGradient id={teal} x1="98" y1="34" x2="134" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7BD9DA" />
          <stop offset="0.38" stopColor="#3DC1C5" />
          <stop offset="0.72" stopColor="#139CAA" />
          <stop offset="1" stopColor="#0E6572" />
        </linearGradient>
        <linearGradient id={tealDeep} x1="78" y1="150" x2="136" y2="205" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3DC1C5" />
          <stop offset="0.55" stopColor="#139CAA" />
          <stop offset="1" stopColor="#0B4C57" />
        </linearGradient>
        <linearGradient id={gold} x1="128" y1="62" x2="212" y2="114" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F2E04E" />
          <stop offset="0.55" stopColor="#E8C97E" />
          <stop offset="1" stopColor="#D1A246" />
        </linearGradient>
        <linearGradient id={orange} x1="198" y1="94" x2="226" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F7A24E" />
          <stop offset="0.6" stopColor="#F28C28" />
          <stop offset="1" stopColor="#C9630F" />
        </linearGradient>
        <radialGradient id={disc} cx="0.34" cy="0.26" r="0.82">
          <stop offset="0" stopColor="#8AE0E1" />
          <stop offset="0.32" stopColor="#3DC1C5" />
          <stop offset="0.72" stopColor="#139CAA" />
          <stop offset="1" stopColor="#0B4C57" />
        </radialGradient>
        <mask id={hole}>
          <rect width="240" height="240" fill="white" />
          <circle cx="156" cy="121" r="14" fill="black" />
        </mask>
      </defs>

      {/* Vinyl shadow */}
      <circle cx="161" cy="126" r="55" fill="#062028" opacity="0.16" />

      {/* Headphone band + cable (behind the disc) */}
      <path
        d="M126 70C145 50 190 54 207 92"
        fill="none"
        stroke={`url(#${gold})`}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M209 145c7 21-12 29-3 51 4 10 15 13 18 25"
        fill="none"
        stroke={`url(#${orange})`}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Vinyl disc */}
      <g mask={`url(#${hole})`}>
        <circle cx="156" cy="121" r="55" fill={`url(#${disc})`} />
        <g fill="none" stroke="#F7FBF9" opacity="0.18">
          <circle cx="156" cy="121" r="47" strokeWidth="1" />
          <circle cx="156" cy="121" r="41" strokeWidth="1" />
          <circle cx="156" cy="121" r="34" strokeWidth="1" />
          <circle cx="156" cy="121" r="27" strokeWidth="1" />
        </g>
        <path
          d="M156 78a43 43 0 0 1 36 19"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.42"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Sound waves inside the disc */}
      <g
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.78"
        strokeWidth="2.4"
        strokeLinecap="round"
      >
        <path d="M176 108a19 19 0 0 1 0 26" />
        <path d="M183 101a29 29 0 0 1 0 40" />
        <path d="M190 94a39 39 0 0 1 0 54" />
      </g>

      {/* Ear cup */}
      <rect
        x="198"
        y="96"
        width="23"
        height="50"
        rx="10"
        fill={`url(#${orange})`}
      />
      <rect
        x="217"
        y="104"
        width="13"
        height="34"
        rx="6"
        fill={`url(#${orange})`}
      />
      <rect
        x="202"
        y="103"
        width="6"
        height="36"
        rx="3"
        fill="#FFFFFF"
        opacity="0.2"
      />

      {/* Note shadow */}
      <g transform="translate(7 8)" fill="#062028" opacity="0.16">
        <rect x="108" y="35" width="22" height="148" rx="11" />
        <ellipse
          cx="97"
          cy="180"
          rx="37"
          ry="28"
          transform="rotate(-18 97 180)"
        />
      </g>

      {/* Note stem */}
      <rect
        x="108"
        y="34"
        width="22"
        height="148"
        rx="11"
        fill={`url(#${teal})`}
      />
      <rect x="113" y="44" width="4" height="128" rx="2" fill="#FFFFFF" opacity="0.28" />

      {/* Note head */}
      <ellipse
        cx="97"
        cy="180"
        rx="37"
        ry="28"
        transform="rotate(-18 97 180)"
        fill={`url(#${tealDeep})`}
      />
      <ellipse
        cx="89"
        cy="171"
        rx="19"
        ry="11"
        transform="rotate(-18 89 171)"
        fill="#FFFFFF"
        opacity="0.18"
      />
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
      aria-label="ART ENERGY — Production and technical consulting"
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
            Production and technical consulting
          </span>
        </span>
      )}
    </span>
  );
}
