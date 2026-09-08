/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#0b57d0',
          dark: '#0842a0',
          light: '#e8f0fe',
          pale2: '#f0f6ff',
        },
        ink: '#202124',
        muted: '#5f6368',
        line: '#dadce0',
        pale: '#e8f0fe',
        pale2: '#f0f6ff',
        white: '#ffffff',
        green: {
          DEFAULT: '#137333',
          light: '#e6f4ea',
        },
        amber: {
          DEFAULT: '#b06000',
          light: '#fef7e0',
        },
        red: {
          DEFAULT: '#b3261e',
          light: '#fce8e6',
        },
      },
      fontFamily: {
        sans: ['Arial', '"Helvetica Neue"', 'sans-serif'],
        heading: ['Arial', '"Helvetica Neue"', 'sans-serif'],
      },
      borderRadius: {
        '28px': '28px',
        '22px': '22px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 8px 30px rgba(32, 33, 36, 0.08)',
        modal: '0 16px 44px rgba(32, 33, 36, 0.16)',
        blueGlow: '0 5px 14px rgba(11, 87, 208, 0.24)',
        subtle: '0 2px 8px rgba(32, 33, 36, 0.12)',
      },
    },
  },
  plugins: [],
};
