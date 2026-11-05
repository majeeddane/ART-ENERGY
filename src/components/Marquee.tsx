"use client";

import { Sparkle } from "@/components/ui/Icons";
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
              "whitespace-nowrap px-5 py-3.5 text-[13px] font-medium sm:px-8 sm:py-4 sm:text-sm",
              outline &&
                "text-transparent [-webkit-text-stroke:1px_rgba(209,162,70,0.65)]",
            )}
          >
            {item}
          </span>
          <Sparkle className="shrink-0 text-gold/70" size={13} />
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
    <div
      className="relative z-20 border-y border-line bg-surface/70 [mask-image:linear-gradient(90deg,transparent,black_7%,black_93%,transparent)]"
      aria-hidden
    >
      <Row items={items} className="text-muted" />
    </div>
  );
}
