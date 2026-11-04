"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "@/components/ui/Icons";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/**
 * Custom cursor: an orange dot with a lagging ring that reacts to links,
 * buttons, "discover" areas and play targets. Disabled on touch devices.
 */
export function Cursor({ discoverLabel }: { discoverLabel: string }) {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"default" | "link" | "discover" | "play">(
    "default",
  );
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

    document.documentElement.dataset.customCursor = "true";
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...mouse };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) setVisible(true);
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "a, button, [data-cursor]",
      );
      if (!target) {
        setMode("default");
        return;
      }
      const kind = target.dataset.cursor;
      if (kind === "discover") setMode("discover");
      else if (kind === "play") setMode("play");
      else setMode("link");
    };

    const onLeave = () => setVisible(false);
    const onDown = () => ring.current?.classList.add("scale-90");
    const onUp = () => ring.current?.classList.remove("scale-90");

    const loop = () => {
      ringPos.x += (mouse.x - ringPos.x) * 0.16;
      ringPos.y += (mouse.y - ringPos.y) * 0.16;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(loop);

    return () => {
      delete document.documentElement.dataset.customCursor;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  if (reduced) return null;

  const isBig = mode === "discover" || mode === "play";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[110] hidden lg:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity .25s ease" }}
    >
      <div
        ref={dot}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-orange-500"
      />
      <div
        ref={ring}
        className="fixed left-0 top-0 flex items-center justify-center rounded-full border border-gold/70 text-[10px] font-semibold text-[#0b2730] backdrop-blur-[1px] transition-[width,height,background-color,border-color] duration-300 ease-outExpo"
        style={{
          width: isBig ? 84 : mode === "link" ? 52 : 34,
          height: isBig ? 84 : mode === "link" ? 52 : 34,
          backgroundColor: isBig ? "rgba(242,224,78,0.92)" : "rgba(209,162,70,0.08)",
          borderColor: isBig ? "rgba(242,224,78,0.9)" : "rgba(209,162,70,0.6)",
        }}
      >
        {mode === "discover" && (
          <span className="whitespace-nowrap">{discoverLabel}</span>
        )}
        {mode === "play" && <Play size={20} />}
        {mode === "link" && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
      </div>
    </div>
  );
}
