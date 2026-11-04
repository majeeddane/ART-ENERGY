"use client";

import { useEffect, useRef, useState } from "react";
import { formatNumber, type Locale } from "@content/site";

export function AnimatedNumber({
  value,
  locale,
  className,
  duration = 550,
}: {
  value: number;
  locale: Locale;
  className?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    const from = previous.current;
    const to = value;
    if (from === to) return;
    previous.current = to;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span className={className} dir="ltr">
      {formatNumber(display, locale)}
    </span>
  );
}
