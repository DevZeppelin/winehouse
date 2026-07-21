/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "./src/**/*.{js,jsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      black: "#000000",
      // Paleta original de WineHouse — se mantiene intacta.
      background: "#072227",
      darkBlue: "#339999",
      middleBlue: "#4FBDBA",
      lightBlue: "#AEFEFF",
      orange: "#cc9933",
      // Extensiones para la nueva plataforma, derivadas de la paleta original.
      surface: "#0c2e35",
      surfaceLight: "#123c45",
      surfaceBorder: "#1c4d57",
      gold: "#e8c15a",
      silver: "#cbd8d9",
      bronze: "#c98a4b",
      success: "#4ade80",
      danger: "#f87171",
      warning: "#fbbf24",
    },
    extend: {
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Ruda", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at 20% 20%, rgba(79,189,186,0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(204,153,51,0.18), transparent 40%), linear-gradient(180deg, #051a1e 0%, #072227 40%)",
        "card-sheen":
          "linear-gradient(135deg, rgba(174,254,255,0.08) 0%, rgba(174,254,255,0) 60%)",
        "gold-gradient": "linear-gradient(135deg, #f4dd97, #cc9933 60%, #a9752a)",
        "silver-gradient": "linear-gradient(135deg, #eef4f4, #9fb4b6 60%, #75898b)",
        "bronze-gradient": "linear-gradient(135deg, #e3a86d, #b06a2f 60%, #7f4a1f)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(174,254,255,0.15), 0 8px 30px rgba(0,0,0,0.35)",
        "glow-orange": "0 0 30px rgba(204,153,51,0.35)",
        card: "0 10px 30px -12px rgba(0,0,0,0.5)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
