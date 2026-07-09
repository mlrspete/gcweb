import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "deep-ocean-navy": "#061826",
        "abyss-blue": "#092A3A",
        "reef-coral": "#FF6B5F",
        "soft-coral-pink": "#FFD1CA",
        seafoam: "#BFEFE3",
        "clear-water-blue": "#DFF7FF",
        "warm-sand": "#F7F3EA",
        "pearl-white": "#FFFCF6",
        ocean: {
          navy: "#061826",
          abyss: "#092A3A",
          clear: "#DFF7FF",
        },
        coral: {
          reef: "#FF6B5F",
          soft: "#FFD1CA",
        },
      },
      backgroundImage: {
        "ocean-depth":
          "radial-gradient(circle at 20% 10%, rgb(223 247 255 / 0.18), transparent 28%), linear-gradient(145deg, #061826 0%, #092A3A 58%, #0E3A4D 100%)",
        "clear-water":
          "linear-gradient(180deg, #FFFCF6 0%, #DFF7FF 55%, #BFEFE3 100%)",
        "coral-sheen":
          "linear-gradient(135deg, #FF6B5F 0%, #FFD1CA 52%, #FFFCF6 100%)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "coral-focus": "0 0 0 4px rgb(255 107 95 / 0.28)",
        "coral-glow": "0 22px 70px rgb(255 107 95 / 0.26)",
        "ocean-soft": "0 24px 80px rgb(6 24 38 / 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
