/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-poppins)', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
        },
        border: 'var(--border)',
        card: 'var(--card)',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
} 