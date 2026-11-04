"use client";

import { Note } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

function Row({
  items,
  className,
  reverse = false,
  outline = false,
}: {
  items: string[];
  className?: string;
  reverse?: boolean;
  outline?: boolean;
}) {
  const group = (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center">
          <span
            className={cn(
              "whitespace-nowrap px-6 py-4 text-sm font-semibold sm:px-9 sm:py-5 sm:text-base",
              outline &&
                "text-transparent [-webkit-text-stroke:1px_rgba(209,162,70,0.65)]",
            )}
          >
            {item}
          </span>
          <Note className="shrink-0 opacity-70" size={18} />
        </span>
      ))}
    </div>
  );

  return (
    <div className={cn("marquee", className)}>
      <div
        className={cn(
          "marquee-track",
          reverse ? "animate-marquee-ltr" : "animate-marquee-rtl",
        )}
        dir="ltr"
      >
        {group}
        {group}
      </div>
    </div>
  );
}

export function MarqueeBand({ items }: { items: string[] }) {
  return (
    <div className="relative z-20 border-y border-gold/25" aria-hidden>
      <Row
        items={items}
        className="bg-[linear-gradient(180deg,#f79d3f,var(--orange)_60%,#e77f1e)] text-[#1B1206]"
      />
      <div className="h-px bg-[#D1A246]/40" />
      <Row
        items={items}
        className="bg-[var(--night-2)] text-[#F2E04E]"
        reverse
        outline
      />
    </div>
  );
}
