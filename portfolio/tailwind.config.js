/** @type {import('tailwindcss').Config} */

// Colors resolve to CSS custom properties defined in src/index.css, so a
// single token switches with the theme instead of every component branching
// on darkMode. <alpha-value> keeps opacity utilities (bg-surface/60) working.
const token = (name) => `rgb(var(${name}) / <alpha-value>)`;

module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  // Reuses the class ThemeContext already puts on <body>. New components can
  // use dark: variants; never mix them with the legacy .light-mode overrides
  // in one component -- both are specificity (0,2,0) and resolve by source order.
  darkMode: ["selector", ".dark-mode"],
  theme: {
    extend: {
      colors: {
        ground: token("--ground"),
        surface: token("--surface"),
        "surface-2": token("--surface-2"),
        ink: token("--ink"),
        muted: token("--muted"),
        accent: token("--accent"),
        "accent-soft": token("--accent-soft"),
        signal: token("--signal"),
        series: token("--series"),
        line: token("--grid"),

        // Legacy palette, still referenced by CommitGraph and a few leftovers.
        primary: "#131024",
        secondary: "#9A94B8",
        tertiary: "#1C1832",
        "black-100": "#1C1832",
        "black-200": "#0E0C1B",
        "white-100": "#f3f3f3",
      },
      fontFamily: {
        // Display only, large sizes. Body text never uses this.
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        sans: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        // Every number, date, metric, tag and readout. Load-bearing.
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        readout: "0.14em",
      },
      borderRadius: {
        // Instrument panels have tight corners.
        panel: "4px",
        chip: "2px",
      },
      boxShadow: {
        panel:
          "0 1px 2px rgb(var(--shadow) / 0.06), 0 8px 24px -12px rgb(var(--shadow) / 0.12)",
        lift: "0 2px 4px rgb(var(--shadow) / 0.08), 0 16px 32px -16px rgb(var(--shadow) / 0.22)",
      },
      screens: { xs: "450px" },
      keyframes: {
        "marquee-left": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-right": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        "tick-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "signal-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        // The var() fallback is required: a var() that resolves to nothing
        // invalidates the whole animation shorthand and silently kills it.
        "marquee-left":
          "marquee-left var(--marquee-duration, 60s) linear infinite",
        "marquee-right":
          "marquee-right var(--marquee-duration, 60s) linear infinite",
        "tick-in": "tick-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "signal-pulse": "signal-pulse 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
