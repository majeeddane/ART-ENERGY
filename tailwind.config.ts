import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2.5rem",
        xl: "3.5rem",
        "2xl": "4rem",
      },
      screens: { "2xl": "1440px" },
    },
    extend: {
      colors: {
        teal: {
          50: "#EAF8F8",
          100: "#D2F0F0",
          200: "#A6E2E3",
          300: "#6FCFD2",
          400: "#3DC1C5",
          500: "#139CAA",
          600: "#0F7F8C",
          700: "#0E6572",
          800: "#0E4E59",
          900: "#0E3F4D",
          950: "#07262F",
        },
        gold: {
          200: "#F3E3B8",
          300: "#E8C97E",
          400: "#DDB55C",
          500: "#D1A246",
          600: "#B8873A",
          700: "#936B2C",
        },
        orange: {
          400: "#F7A24E",
          500: "#F28C28",
          600: "#D97416",
        },
        yellow: "#F2E04E",
        ink: "#0B2730",
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        foreground: "var(--fg)",
        muted: "var(--muted)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        card: "var(--card)",
      },
      fontFamily: {
        arabic: ["var(--font-arabic)", "system-ui", "sans-serif"],
        grotesk: ["var(--font-grotesk)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "clamp-hero": "clamp(3.2rem, 8.2vw, 8.6rem)",
        "clamp-title": "clamp(2.3rem, 5.4vw, 5rem)",
        "clamp-sub": "clamp(1.45rem, 2.6vw, 2.35rem)",
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      transitionTimingFunction: {
        outExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
        inOutExpo: "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      borderRadius: {
        // unified corner language: pill > panel > card > tile
        tile: "1rem",
        card: "1.4rem",
        panel: "1.75rem",
        stage: "2.25rem",
      },
      boxShadow: {
        soft: "0 24px 80px -32px rgba(11, 39, 48, 0.35)",
        gold: "0 0 0 1px rgba(209, 162, 70, 0.35), 0 24px 60px -28px rgba(209, 162, 70, 0.45)",
        lift: "0 40px 90px -40px rgba(7, 38, 47, 0.55)",
        glass:
          "0 8px 32px -12px rgba(2, 16, 21, 0.5), inset 0 1px 0 0 rgba(247, 242, 233, 0.14)",
        "soft-hover": "0 34px 90px -30px rgba(11, 39, 48, 0.42)",
      },
      animation: {
        "spin-slow": "spin 26s linear infinite",
        "spin-reverse": "spin-reverse 34s linear infinite",
        "marquee-rtl": "marquee-rtl 30s linear infinite",
        "marquee-ltr": "marquee-ltr 34s linear infinite",
        "pulse-soft": "pulse-soft 2.8s ease-in-out infinite",
        float: "float 7s ease-in-out infinite",
        eq: "eq 1.1s ease-in-out infinite alternate",
        "eq-slow": "eq 1.8s ease-in-out infinite alternate",
        shimmer: "shimmer 2.4s linear infinite",
        "ring-spin": "spin 40s linear infinite",
      },
      keyframes: {
        "spin-reverse": {
          from: { transform: "rotate(360deg)" },
          to: { transform: "rotate(0deg)" },
        },
        "marquee-rtl": {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(-50%,0,0)" },
        },
        "marquee-ltr": {
          from: { transform: "translate3d(-50%,0,0)" },
          to: { transform: "translate3d(0,0,0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.55", transform: "scale(0.96)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        eq: {
          "0%": { transform: "scaleY(0.25)" },
          "100%": { transform: "scaleY(1)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
