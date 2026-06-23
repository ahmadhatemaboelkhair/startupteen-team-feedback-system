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
          ink: "#182033",
          muted: "#667085",
          line: "#eef0f4",
          soft: "#fff4eb"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(24, 32, 51, 0.10)",
        panel: "0 10px 30px rgba(24, 32, 51, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
