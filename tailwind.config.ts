import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        night: "#0F172A",
        candle: "#FBBF24",
        cream: "#FFF7ED",
        mint: "#A7F3D0",
        ink: "#1E293B",
        mist: "#94A3B8"
      },
      boxShadow: {
        glow: "0 20px 70px rgba(251, 191, 36, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
