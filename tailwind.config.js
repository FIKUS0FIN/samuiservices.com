/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: '#f8f9ff',
        'surface-card': '#ffffff',
        primary: '#0058be',
        'primary-hover': '#004395',
        'primary-container': '#2170e4',
        'primary-text': '#fefcff',
        secondary: '#006c49',
        'secondary-container': '#6cf8bb',
        'secondary-text': '#00714d',
        accent: '#924700',
        'text-main': '#0b1c30',
        'text-muted': '#424754',
        outline: '#727785',
        'outline-muted': '#c2c6d6',
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'headline-sm': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        'label-md': ['16px', { lineHeight: '1.6', fontWeight: '500' }],
        'label-sm': ['14px', { lineHeight: '1.6', fontWeight: '600' }],
      },
      spacing: {
        'base': '8px',
        'section': '80px',
      },
      maxWidth: {
        'container': '1280px',
      },
      borderRadius: {
        'global': '8px',
        'card': '16px',
        'pill': '9999px',
      },
      boxShadow: {
        'level-1': '0 4px 12px 0 rgba(0, 0, 0, 0.04)',
        'level-2': '0 8px 24px 0 rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
