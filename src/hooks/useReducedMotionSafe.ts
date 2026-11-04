"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe reduced-motion hook.
 *
 * Framer's `useReducedMotion` reads `matchMedia` during the first client
 * render, while the server always renders the non-reduced branch. That
 * difference causes a hydration mismatch. This hook starts from `false`
 * (matching the server) and updates only after hydration.
 */
export function useReducedMotionSafe() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
