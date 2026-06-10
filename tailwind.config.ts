import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy:         "#062244",
        primary:      "#00399D",
        secondary:    "#27B8FF",
        gray:         "#B3B3B3",
        background:   "#FBFBFB",
        black:        "#141414",
        success:      "#059669",
        error:        "#DC2626",
        warning:      "#FACC15",
        "success-bg": "#D1FAE5",
        "error-bg":   "#FEE2E2",
        "warning-bg": "#FEFCE8",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
      },
      fontSize: {
        "display-2xl": ["4.5rem",   { lineHeight:"1.0",  letterSpacing:"-0.03em",  fontWeight:"800" }],
        "display-xl":  ["3.75rem",  { lineHeight:"1.0",  letterSpacing:"-0.025em", fontWeight:"800" }],
        "display-lg":  ["3rem",     { lineHeight:"1.05", letterSpacing:"-0.025em", fontWeight:"800" }],
        "display-md":  ["2.25rem",  { lineHeight:"1.1",  letterSpacing:"-0.02em",  fontWeight:"800" }],
        "h1": ["2.25rem",  { lineHeight:"1.1",  letterSpacing:"-0.02em",  fontWeight:"800" }],
        "h2": ["1.875rem", { lineHeight:"1.15", letterSpacing:"-0.015em", fontWeight:"800" }],
        "h3": ["1.5rem",   { lineHeight:"1.2",  letterSpacing:"-0.01em",  fontWeight:"700" }],
        "h4": ["1.25rem",  { lineHeight:"1.3",  letterSpacing:"-0.01em",  fontWeight:"700" }],
        "h5": ["1.125rem", { lineHeight:"1.4",  letterSpacing:"0",        fontWeight:"600" }],
        "h6": ["1rem",     { lineHeight:"1.5",  letterSpacing:"0",        fontWeight:"600" }],
        "body-xl": ["1.25rem",   { lineHeight:"1.6", fontWeight:"400" }],
        "body-lg": ["1.125rem",  { lineHeight:"1.6", fontWeight:"400" }],
        "body-md": ["1rem",      { lineHeight:"1.6", fontWeight:"400" }],
        "body-sm": ["0.875rem",  { lineHeight:"1.6", fontWeight:"400" }],
        "body-xs": ["0.75rem",   { lineHeight:"1.5", fontWeight:"400" }],
        "label-lg": ["0.875rem",  { lineHeight:"1.4", letterSpacing:"0.04em", fontWeight:"600" }],
        "label-md": ["0.75rem",   { lineHeight:"1.4", letterSpacing:"0.06em", fontWeight:"600" }],
        "label-sm": ["0.6875rem", { lineHeight:"1.4", letterSpacing:"0.08em", fontWeight:"600" }],
        "label-xs": ["0.625rem",  { lineHeight:"1.4", letterSpacing:"0.1em",  fontWeight:"600" }],
      },
      borderRadius: {
        "xs":   "4px",
        "sm":   "8px",
        "md":   "12px",
        "lg":   "16px",
        "xl":   "20px",
        "2xl":  "24px",
        "card": "48px",
        "chip": "32px",
        "full": "9999px",
      },
      boxShadow: {
        "card":       "0 1px 4px rgba(6,34,68,0.06)",
        "card-hover": "0 8px 32px rgba(6,34,68,0.10)",
        "modal":      "0 20px 60px rgba(6,34,68,0.15)",
        "float":      "0 12px 40px rgba(6,34,68,0.12)",
      },
      backgroundImage: {
        "mesh-brand": `
          radial-gradient(ellipse at 20% 50%,
            rgba(39,184,255,0.30) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 20%,
            rgba(0,57,157,0.50) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%,
            rgba(39,184,255,0.15) 0%, transparent 45%),
          linear-gradient(135deg, #062244 0%, #062244 100%)
        `,
        "gradient-brand":
          "linear-gradient(130deg, #27B8FF 0%, #00399D 100%)",
        "gradient-dark":
          "linear-gradient(130deg, #00399D 0%, #062244 100%)",
        "dot-grid":
          "radial-gradient(circle, rgba(143,163,184,0.6) 1.5px, transparent 1.5px)",
      },
      backgroundSize: {
        "dot": "28px 28px",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity:"0", transform:"translateY(40px)" },
          "100%": { opacity:"1", transform:"translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity:"0" },
          "100%": { opacity:"1" },
        },
        "slide-up": {
          "0%":   { opacity:"0", transform:"translateY(20px)" },
          "100%": { opacity:"1", transform:"translateY(0)" },
        },
      },
      animation: {
        "fade-up":  "fade-up 0.6s cubic-bezier(0.4,0,0.2,1) forwards",
        "fade-in":  "fade-in 0.4s cubic-bezier(0.4,0,0.2,1) forwards",
        "slide-up": "slide-up 0.4s cubic-bezier(0.4,0,0.2,1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
