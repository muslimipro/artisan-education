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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        "gray-light": "var(--gray-light)",
        gray: "var(--gray)",
        "gray-dark": "var(--gray-dark)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-in-out",
        "slide-down": "slideDown 0.5s ease-in-out",
        "slide-left": "slideLeft 0.5s ease-in-out",
        "slide-right": "slideRight 0.5s ease-in-out",
        "marquee": "scroll var(--duration) linear infinite",
        "marquee-reverse": "scroll var(--duration) linear infinite reverse",
        "custom-fade-in": "customFadeIn 0.4s ease-out forwards",
        "custom-pulse": "customPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "checkmark-appear": "checkmarkAppear 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideLeft: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        customFadeIn: {
          "from": { opacity: "0", transform: "translateY(5px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        customPulse: {
          "0%": { opacity: "1", transform: "scale(1)", boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.4)" },
          "50%": { opacity: "0.85", transform: "scale(1.08)", boxShadow: "0 0 0 6px rgba(34, 197, 94, 0)" },
          "100%": { opacity: "1", transform: "scale(1)", boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.4)" },
        },
        checkmarkAppear: {
          "0%": { strokeDashoffset: "30", opacity: "0" },
          "100%": { strokeDashoffset: "0", opacity: "1" },
        },
      },
      perspective: {
        '1000': '1000px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.shadow-glow': {
          boxShadow: '0 0 12px 5px rgba(34, 197, 94, 0.9), 0 0 10px 5px rgba(34, 197, 94, 0.4)',
        },
        '.circuit-instructions .bg-slate-50:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease',
        },
        '.circuit-instructions ul li': {
          opacity: '0',
          animation: 'fadeIn 0.5s ease-in-out forwards',
        },
        '.circuit-instructions ul li:nth-child(1)': {
          animationDelay: '0.1s',
        },
        '.circuit-instructions ul li:nth-child(2)': {
          animationDelay: '0.3s',
        },
        '.bg-green-50': {
          transition: 'all 0.5s ease',
        },
        '.border-green-400': {
          boxShadow: '0 0 0 1px rgba(74, 222, 128, 0.5), 0 3px 6px rgba(74, 222, 128, 0.1)',
          transition: 'box-shadow 0.3s ease',
        },
        '*': {
          backfaceVisibility: 'hidden',
        },
      });
    },
  ],
};
export default config;
