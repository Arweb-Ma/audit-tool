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
        bg: '#f9f8f6',
        white: '#ffffff',
        black: '#111110',
        textMain: '#1a1a18',
        muted: '#6b6b69',
        light: '#e8e6e1',
        borderLine: '#e2e0db',
        tagBg: '#f0ede8',
        accent: {
          DEFAULT: '#0052cc',
          hover: '#0043a8',
          light: '#e8f0ff',
        },
        emeraldGlow: '#059669',
        emeraldLight: '#ecfdf5',
        amberGlow: '#d97706',
        amberLight: '#fffbe6',
        roseGlow: '#dc2626',
        roseLight: '#fef2f2',
      },
      fontFamily: {
        heading: ['Bricolage Grotesque', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(0, 0, 0, 0.04)',
        cardHover: '0 8px 30px rgba(0, 82, 204, 0.08)',
        modal: '0 20px 50px rgba(17, 17, 16, 0.12)',
      },
    },
  },
  plugins: [],
};
