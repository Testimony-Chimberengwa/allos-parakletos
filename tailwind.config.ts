/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sacred Playful Design System
        surface: '#e4ffce',
        'surface-container-low': '#ceffad',
        'surface-container': '#a5ff72',
        'surface-container-high': '#8cee4a',
        'surface-container-highest': '#6dfb00',
        'surface-container-lowest': '#ffffff',
        
        primary: '#006093',
        'primary-container': '#32abfa',
        'primary-dim': '#00497d',
        
        secondary: '#556300',
        'secondary-container': '#ffd709',
        
        tertiary: '#6bfe9c',
        'tertiary-container': '#6bfe9c',
        
        'on-surface': '#123600',
        'on-primary': '#ebf3ff',
        'on-secondary-container': '#5b4b00',
        'outline-variant': '#54c500',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        headline: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Be Vietnam Pro', 'sans-serif'],
        sans: ['Be Vietnam Pro', 'sans-serif'],
      },
      fontSize: {
        'title-lg': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'title-md': ['1rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.6' }],
        'body-md': ['0.875rem', { lineHeight: '1.5' }],
        'label': ['0.75rem', { lineHeight: '1.2', fontWeight: '600' }],
      },
      borderRadius: {
        'sm': '0.5rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
      },
      boxShadow: {
        'ambient': '0 30px 30px rgba(18, 54, 0, 0.06)',
        'button': '0 4px 0 rgba(0, 73, 125, 0.4)',
      },
      backdropBlur: {
        'md': '20px',
      },
    },
  },
  plugins: [],
}
