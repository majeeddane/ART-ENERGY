"use client";

import { useEffect, useRef } from "react";

/** A slim progress rail that tracks how far the page has scrolled. */
export function ScrollProgress() {
  const dotRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (dotRef.current) {
        dotRef.current.style.transform = `translateY(${p * 100}%)`;
      }
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleY(${p})`;
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${p})`;
      }
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-[2px] bg-transparent lg:hidden"
      >
        <div
          ref={barRef}
          className="h-full origin-left bg-gradient-to-r from-teal-500 via-teal-300 to-gold-500"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none fixed bottom-1/2 z-[80] hidden h-[240px] w-8 translate-y-1/2 flex-col justify-center lg:flex"
        style={{ insetInlineStart: "0.6rem" }}
      >
        <div className="relative h-full w-full">
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line-strong/60" />
          <div
            ref={fillRef}
            className="absolute inset-y-0 left-1/2 w-px origin-top -translate-x-1/2 bg-gradient-to-b from-teal-500 via-teal-300 to-gold-500"
            style={{ transform: "scaleY(0)" }}
          />
          <div
            ref={dotRef}
            className="absolute left-1/2 top-0 -translate-x-1/2"
          >
            <span className="block h-2 w-2 rounded-full border border-gold-500 bg-canvas shadow-[0_0_0_3px_rgba(209,162,70,0.18)]" />
          </div>
        </div>
      </div>
    </>
  );
}
