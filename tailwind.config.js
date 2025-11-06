/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#EF4444',
          light: '#EF4444',
          dark: '#B91C1C',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        background: {
          light: '#FFFFFF',
          dark: '#0F0F0F',
        },
        header: {
          light: '#EF4444',
          dark: '#1F1F1F',
        },
        shadow: {
          light: 'rgba(0, 0, 0, 0.1)',
          dark: 'rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
  plugins: [],
};
