"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

export function Preloader({ skipLabel }: { skipLabel: string }) {
  const [visible, setVisible] = useState(true);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [removed, setRemoved] = useState(false);
  const reduced = useReducedMotionSafe();
  const started = useRef(false);

  const finish = () => {
    setDone(true);
    setProgress(100);
    (window as unknown as { __aeReady?: boolean }).__aeReady = true;
    window.dispatchEvent(new Event("ae:ready"));
    window.setTimeout(() => setVisible(false), 450);
    window.setTimeout(() => setRemoved(true), 520);
  };

  useEffect(() => {
    try {
      if (sessionStorage.getItem("ae-preloaded") === "1") {
        (window as unknown as { __aeReady?: boolean }).__aeReady = true;
        window.dispatchEvent(new Event("ae:ready"));
        setRemoved(true);
        setVisible(false);
        return;
      }
    } catch {
      /* ignore */
    }
    try {
      sessionStorage.setItem("ae-preloaded", "1");
    } catch {
      /* ignore */
    }

    if (reduced) {
      (window as unknown as { __aeReady?: boolean }).__aeReady = true;
      window.dispatchEvent(new Event("ae:ready"));
      setRemoved(true);
      setVisible(false);
      return;
    }

    if (started.current) return;
    started.current = true;

    const duration = 600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };
    raf = requestAnimationFrame(tick);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  if (removed) return null;

  return (
    <div
      className="preloader-mask fixed inset-0 z-[120]"
      data-done={done}
      aria-hidden={!visible}
      style={{ pointerEvents: done ? "none" : "auto" }}
    >
      <div className="preloader grain flex h-full w-full flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(19,156,170,0.28),transparent_65%)] blur-2xl" />
          <div className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(209,162,70,0.16),transparent_60%)] blur-2xl" />
        </div>

        <div className="relative flex flex-col items-center">
          <motion.div
            className="relative flex h-44 w-44 items-center justify-center"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg viewBox="0 0 200 200" className="h-36 w-36" aria-hidden>
              <circle
                cx="100"
                cy="100"
                r="76"
                fill="none"
                stroke="#D1A246"
                strokeOpacity="0.22"
                strokeWidth="1"
                strokeDasharray="3 9"
              />
              <motion.circle
                cx="100"
                cy="100"
                r="63"
                fill="none"
                stroke="#3DC1C5"
                strokeWidth="1.4"
                strokeDasharray="396"
                initial={{ pathLength: 0, opacity: 0.2 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
              <motion.path
                d="M108 46v74"
                stroke="#3DC1C5"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              />
              <motion.ellipse
                cx="99"
                cy="124"
                rx="13"
                ry="9.5"
                transform="rotate(-18 99 124)"
                fill="#139CAA"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.circle
                cx="100"
                cy="100"
                r="46"
                fill="none"
                stroke="#F2E04E"
                strokeOpacity="0.5"
                strokeWidth="0.8"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />
            </svg>
            <motion.span
              className="absolute -bottom-3 font-grotesk text-[10px] tracking-[0.3em] text-[#F2E04E]/80"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              dir="ltr"
            >
              ART ENERGY
            </motion.span>
          </motion.div>

          <div className="mt-16 flex w-[min(78vw,360px)] items-center justify-between font-grotesk text-[10px] uppercase tracking-[0.3em] text-[#F7F2E9]/60">
            <span dir="ltr">SOUND</span>
            <span className="text-[#F2E04E]" dir="ltr">
              {progress.toString().padStart(2, "0")}%
            </span>
            <span dir="ltr">VISION</span>
          </div>
          <div className="mt-4 h-[2px] w-[min(78vw,360px)] overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#139CAA] via-[#3DC1C5] to-[#D1A246] transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={finish}
          className="absolute bottom-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs font-medium text-[#F7F2E9]/70 transition hover:border-[#D1A246] hover:text-[#F2E04E]"
        >
          {skipLabel}
          <span aria-hidden className="font-grotesk">
            ESC
          </span>
        </button>
      </div>
    </div>
  );
}
