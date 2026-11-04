"use client";

import { useEffect, useRef } from "react";
import { Note } from "@/components/ui/Icons";

/** A note travelling down a five-line staff as the page scrolls. */
export function ScrollProgress() {
  const noteRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (noteRef.current) {
        noteRef.current.style.transform = `translateY(${p * 100}%)`;
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleY(${p})`;
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
          className="h-full origin-top bg-gradient-to-r from-teal-500 via-teal-300 to-gold-500"
          style={{ transform: "scaleY(0)" }}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none fixed bottom-1/2 z-[80] hidden h-[240px] w-10 translate-y-1/2 flex-col justify-center lg:flex"
        style={{ insetInlineStart: "0.6rem" }}
      >
        <div className="relative h-full w-full">
          <div className="staff-lines absolute inset-y-0 left-1/2 w-7 -translate-x-1/2 opacity-50" />
          <div
            ref={noteRef}
            className="absolute left-1/2 top-0 -translate-x-1/2 text-gold-500 transition-transform duration-150"
          >
            <Note size={16} />
          </div>
        </div>
      </div>
    </>
  );
}
