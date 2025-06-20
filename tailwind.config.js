/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      colors: {
        primary: {
          DEFAULT: '#2563EB', // vibrant blue
          light: '#3B82F6',
          dark: '#1E40AF',
        },
        accent: {
          DEFAULT: '#22D3EE', // cyan
          light: '#67E8F9',
          dark: '#0E7490',
        },
        gold: {
          DEFAULT: '#FFD700',
          dark: '#BFA100',
        },
        pitchblack: {
          DEFAULT: '#0A0A0A',
        },
        white: '#FFFFFF',
      },
    },
  },
  darkMode: "class",
}
