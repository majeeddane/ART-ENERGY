"use client";

import { useRef, type ReactNode } from "react";
import { cn, prefersReducedMotion } from "@/lib/utils";

export function TiltCard({
  children,
  className,
  innerClassName,
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  max?: number;
}) {
  const inner = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = inner.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * max * 2;
    const ry = (px - 0.5) * max * 2;
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  const reset = () => {
    const el = inner.current;
    if (!el) return;
    el.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)";
  };

  return (
    <div
      className={cn("tilt-wrap h-full", className)}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      <div
        ref={inner}
        className={cn(
          "tilt-inner relative h-full overflow-hidden rounded-panel",
          innerClassName,
        )}
      >
        {children}
        <div
          aria-hidden
          className="tilt-glare pointer-events-none absolute inset-0 z-20 mix-blend-soft-light"
        />
      </div>
    </div>
  );
}
