import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        elderly: {
          bg: "#F8FAFC",
          card: "#FFFFFF",
          accent: "#2563EB",
          accentHover: "#1D4ED8",
          success: "#16A34A",
          successHover: "#15803D",
          warning: "#D97706",
          danger: "#DC2626",
          text: "#0F172A",
          muted: "#475569",
        },
      },
      fontSize: {
        "accessible-base": "1.25rem", // 20px for easier reading
        "accessible-lg": "1.5rem",   // 24px
        "accessible-xl": "1.875rem", // 30px
        "accessible-2xl": "2.25rem", // 36px
        "accessible-3xl": "3rem",    // 48px
      },
    },
  },
  plugins: [],
};
export default config;
