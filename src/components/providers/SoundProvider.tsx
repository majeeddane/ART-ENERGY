"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

type SoundName = "click" | "open" | "success" | "hover";

type AudioCtx = {
  enabled: boolean;
  toggle: () => void;
  play: (name?: SoundName) => void;
};

const SoundContext = createContext<AudioCtx | null>(null);

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used inside <SoundProvider>");
  return ctx;
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      setEnabled(localStorage.getItem("ae-sound") === "on");
    } catch {
      /* ignore */
    }
  }, []);

  const getCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    if (!audioRef.current) audioRef.current = new AC();
    if (audioRef.current.state === "suspended") {
      void audioRef.current.resume();
    }
    return audioRef.current;
  }, []);

  const play = useCallback(
    (name: SoundName = "click") => {
      if (!enabled) return;
      const ctx = getCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.connect(ctx.destination);
      master.gain.setValueAtTime(0.0001, now);

      const notes =
        name === "success"
          ? [392, 523.25, 659.25, 783.99]
          : name === "open"
            ? [261.63, 392]
            : name === "hover"
              ? [880]
              : [523.25];

      master.gain.exponentialRampToValueAtTime(
        name === "hover" ? 0.018 : 0.05,
        now + 0.02,
      );
      master.gain.exponentialRampToValueAtTime(
        0.0001,
        now + (name === "success" ? 1.1 : 0.22),
      );

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.0001, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.9, now + i * 0.06 + 0.015);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          now + i * 0.06 + (name === "success" ? 0.65 : 0.2),
        );
        osc.connect(gain);
        gain.connect(master);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 1.2);
      });
    },
    [enabled, getCtx],
  );

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("ae-sound", next ? "on" : "off");
      } catch {
        /* ignore */
      }
      if (next) {
        // Unlock audio inside the user gesture.
        getCtx();
      }
      return next;
    });
  }, [getCtx]);

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
