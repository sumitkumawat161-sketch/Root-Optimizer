/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe6fe",
          200: "#bdd1fe",
          300: "#90b3fd",
          400: "#5c8bfa",
          500: "#3b66f5",
          600: "#2745e9",
          700: "#2136c9",
          800: "#212fa0",
          900: "#212c7e",
          950: "#161a4a"
        },
        accent: {
          400: "#22d3c9",
          500: "#0fb8ad",
          600: "#0b968d"
        },
        surface: {
          light: "#f6f7fb",
          dark: "#0b0f1a"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(16, 24, 40, 0.06), 0 1px 2px -1px rgba(16, 24, 40, 0.04)",
        card: "0 4px 24px -4px rgba(16, 24, 40, 0.08), 0 2px 8px -2px rgba(16, 24, 40, 0.04)",
        glow: "0 0 0 1px rgba(59, 102, 245, 0.08), 0 8px 30px -8px rgba(59, 102, 245, 0.35)"
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem"
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #3b66f5 0%, #6d5df5 50%, #0fb8ad 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, rgba(59,102,245,0.12) 0%, rgba(109,93,245,0.10) 50%, rgba(15,184,173,0.10) 100%)",
        "mesh": "radial-gradient(at 0% 0%, rgba(59,102,245,0.18) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(15,184,173,0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(109,93,245,0.15) 0px, transparent 50%)"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        "scale-in": {
          "0%": { opacity: 0, transform: "scale(0.96)" },
          "100%": { opacity: 1, transform: "scale(1)" }
        },
        "slide-in-right": {
          "0%": { opacity: 0, transform: "translateX(12px)" },
          "100%": { opacity: 1, transform: "translateX(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" }
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: 0.6 },
          "80%, 100%": { transform: "scale(1.6)", opacity: 0 }
        }
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        shimmer: "shimmer 1.6s infinite linear",
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.2,0.6,0.4,1) infinite"
      }
    }
  },
  plugins: []
};
