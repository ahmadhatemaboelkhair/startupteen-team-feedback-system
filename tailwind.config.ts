import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#ff7a1a",
          orangeDark: "#e45f00",
          blue: "#0867d8",
          blueDark: "#064aa3",
          yellow: "#ffd12f",
          ink: "#182033",
          muted: "#667085",
          line: "#eef0f4",
          soft: "#fff4eb",
          sky: "#edf6ff"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(24, 32, 51, 0.10)",
        panel: "0 14px 40px rgba(24, 32, 51, 0.08)",
        brand: "0 18px 36px rgba(255, 122, 26, 0.24)"
      }
    }
  },
  plugins: []
};

export default config;
