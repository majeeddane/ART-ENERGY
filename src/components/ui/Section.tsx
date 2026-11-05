import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 eyebrow",
        tone === "light" ? "text-[#F7F2E9]/70" : "text-muted",
        className,
      )}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
      {children}
    </span>
  );
}

export function GrowthMeter({
  className,
  bars = 5,
}: {
  className?: string;
  bars?: number;
}) {
  return (
    <span className={cn("meter", className)} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          style={{ height: `${34 + (i / Math.max(1, bars - 1)) * 66}%` }}
        />
      ))}
    </span>
  );
}
