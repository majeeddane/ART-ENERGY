"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight WebGL sound-wave field for the hero.
 * - One full-screen plane + a single fragment shader (no post-processing).
 * - Pauses when off-screen or the tab is hidden.
 * - Bails out silently when WebGL is unavailable; the CSS gradient remains.
 */
export function ThreeWaves({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The shader is decorative. Skip it on small screens and low-power
    // devices, where the CSS gradient fallback looks identical in practice
    // and native scrolling stays smooth.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer || window.innerWidth < 900) return;

    // Probe for hardware-accelerated WebGL first. Three logs loudly when a
    // context cannot be created; probing lets the page fall back silently on
    // software renderers (headless CI, VMs, older machines).
    const hasWebGL = (() => {
      try {
        const probe = document.createElement("canvas");
        const gl =
          probe.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
          probe.getContext("webgl", { failIfMajorPerformanceCaveat: true });
        if (!gl) return false;
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return true;
      } catch {
        return false;
      }
    })();
    if (!hasWebGL) return;

    let disposed = false;
    let raf = 0;
    let renderer: import("three").WebGLRenderer | null = null;
    let cleanupResize: (() => void) | null = null;
    let visible = true;

    const boot = async () => {
      if (disposed) return;
      const THREE = await import("three");
      if (disposed) return;

      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: true,
        });
      } catch {
        return;
      }

      const maxDpr = Math.min(window.devicePixelRatio || 1, 1.25);
      renderer.setPixelRatio(maxDpr);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const uniforms = {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uAspect: { value: 1 },
        uOpacity: { value: 1 },
      };

      const material = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          precision highp float;
          varying vec2 vUv;
          uniform float uTime;
          uniform vec2 uMouse;
          uniform float uAspect;
          uniform float uOpacity;

          void main() {
            vec2 p = vUv - 0.5;
            p.x *= uAspect;

            float edge = smoothstep(0.92, 0.18, length(p * vec2(0.9, 1.25)));
            vec3 teal = vec3(0.078, 0.576, 0.655);
            vec3 cyan = vec3(0.239, 0.757, 0.773);
            vec3 gold = vec3(0.82, 0.635, 0.275);
            vec3 col = vec3(0.0);

            for (int i = 0; i < 8; i++) {
              float fi = float(i);
              float y0 = (fi - 3.5) * 0.078;
              float amp = 0.028 + 0.022 * sin(fi * 1.37 + 0.6);
              float freq = 2.6 + fi * 0.19;
              float phase = uTime * (0.42 + fi * 0.021) + fi * 0.45;
              float y = y0
                + amp * sin(p.x * freq + phase + uMouse.x * 1.1)
                + amp * 0.55 * sin(p.x * (freq * 1.9) - uTime * 0.7 + fi)
                + uMouse.y * 0.045 * cos(p.x * 1.5 + fi);

              float d = abs(p.y - y);
              float line = smoothstep(0.0042, 0.0004, d);
              float glow = smoothstep(0.085, 0.0, d);

              vec3 c = mix(cyan, teal, smoothstep(-0.2, 0.5, p.x));
              c = mix(c, gold, smoothstep(0.05, 0.85, p.x + sin(fi * 2.0) * 0.18));

              col += c * line * (0.55 + 0.35 * sin(fi));
              col += c * glow * 0.035;
            }

            float center = smoothstep(0.02, 0.0, abs(p.y));
            col += vec3(0.85, 0.82, 0.7) * center * 0.05;

            float pulse = 0.55 + 0.45 * sin(uTime * 0.7);

            gl_FragColor = vec4(col * edge * uOpacity * pulse, 1.0);
          }
        `,
      });

      const geo = new THREE.PlaneGeometry(2, 2);
      scene.add(new THREE.Mesh(geo, material));

      const resize = () => {
        if (!renderer) return;
        const w = canvas.clientWidth || window.innerWidth;
        const h = canvas.clientHeight || window.innerHeight;
        renderer.setSize(w, h, false);
        uniforms.uAspect.value = w / Math.max(h, 1);
      };
      resize();

      const ro = new ResizeObserver(resize);
      ro.observe(canvas);
      cleanupResize = () => ro.disconnect();

      const target = { x: 0, y: 0 };
      const onPointer = (e: PointerEvent) => {
        target.x = (e.clientX / window.innerWidth - 0.5) * 2;
        target.y = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      const io = new IntersectionObserver(
        (entries) => {
          visible = entries[0]?.isIntersecting ?? true;
        },
        { threshold: 0.02 },
      );
      io.observe(canvas);

      const onVisibility = () => {
        visible = !document.hidden;
      };
      document.addEventListener("visibilitychange", onVisibility);

      const clock = new THREE.Clock();
      let mx = 0;
      let my = 0;
      let last = 0;

      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;
        // 30fps is plenty for this slow wave field and halves GPU work.
        if (now - last < 32) return;
        last = now;
        const t = clock.getElapsedTime();
        mx += (target.x - mx) * 0.03;
        my += (target.y - my) * 0.03;
        uniforms.uTime.value = t;
        uniforms.uMouse.value.set(mx, my);
        renderer?.render(scene, camera);
      };
      raf = requestAnimationFrame(loop);

      return () => {
        window.removeEventListener("pointermove", onPointer);
        document.removeEventListener("visibilitychange", onVisibility);
        io.disconnect();
        ro.disconnect();
        geo.dispose();
        material.dispose();
        renderer?.dispose();
        renderer = null;
      };
    };

    let innerCleanup: (() => void) | undefined;
    // Let the hero paint first, then boot WebGL during idle time.
    const bootTimer = window.setTimeout(() => {
      void boot().then((fn) => {
        innerCleanup = fn;
      });
    }, 700);

    return () => {
      disposed = true;
      window.clearTimeout(bootTimer);
      cancelAnimationFrame(raf);
      innerCleanup?.();
      cleanupResize?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
