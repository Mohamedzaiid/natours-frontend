/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'dark:bg-gray-900',
    'dark:bg-gray-800',
    'dark:text-white',
    'dark:text-gray-200',
    'dark:text-gray-300',
    'dark:text-gray-400',
    'dark:border-gray-700',
    'dark:hover:bg-gray-700',
    'dark:bg-gray-800/50',
    'dark:hover:bg-gray-800/70',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#55c57a",
          light: "#7ed56f",
          dark: "#28b485",
        },
        secondary: "#ff7730",
        tertiary: "#2998ff",
        gray: {
          light: "#f7f7f7",
          dark: "#777",
        }
      },
      fontFamily: {
        // poppins: ['var(--font-poppins)', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};