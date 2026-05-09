/** @type {import('tailwindcss').Config} */
export default {
content: [
  "./index.html",
  "./src/**/*.js",
  "./src/**/*.jsx",
  "./src/**/*.ts",
  "./src/**/*.tsx",
],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
        serif: ["DM Serif Display", "serif"],
      },
      colors: {
        red: {
          50:  "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
        },
      },
      borderRadius: {
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        red:    "0 8px 32px rgba(193,21,42,.25)",
        "red-lg":"0 12px 48px rgba(193,21,42,.35)",
      },
    },
  },
  plugins: [],
};
