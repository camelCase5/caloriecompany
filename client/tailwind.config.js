// tailwind config where i play with a small color palette
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#f97316", 600: "#ea580c", 700: "#c2410c" },
        accent: { DEFAULT: "#2563eb", 600: "#1d4ed8" },
        sand: "#eadfc8",
        cream: "#fff7ed",
        slate: "#64748b",
      },
      borderRadius: {
        xl: "14px",
      },
      boxShadow: {
        soft: "0 6px 24px -12px rgba(2, 6, 23, 0.15)",
      },
    },
  },
  plugins: [],
};
