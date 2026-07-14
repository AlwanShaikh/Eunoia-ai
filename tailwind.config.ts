import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8f7ff',
          100: '#efeaff',
          200: '#ddd7ff',
          300: '#c2b5ff',
          400: '#a48aff',
          500: '#8b6dff',
          600: '#744fe8',
          700: '#5d3cc0',
          800: '#4b3298',
          900: '#3e2b75',
        },
        crimson: {
          50: '#fdf2f4',
          100: '#fce7ea',
          200: '#f9d0d9',
          300: '#f4a9b9',
          400: '#ed7894',
          500: '#e34d71',
          600: '#dc143c',
          700: '#b80f33',
          800: '#9a0e2d',
          900: '#80102a',
        },
      },
      animation: {
        'pulse-crimson': 'pulse-crimson 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-crimson': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;