/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "tertiary": "#924700",
        "on-tertiary-fixed-variant": "#723600",
        "error": "#ba1a1a",
        "tertiary-fixed-dim": "#ffb786",
        "background": "#f8f9ff",
        "tertiary-fixed": "#ffdcc6",
        "outline-variant": "#c2c6d6",
        "on-secondary-container": "#00714d",
        "on-secondary-fixed-variant": "#005236",
        "surface-container-highest": "#d3e4fe",
        "inverse-primary": "#adc6ff",
        "on-secondary-fixed": "#002113",
        "on-surface-variant": "#424754",
        "surface-container": "#e5eeff",
        "on-primary": "#ffffff",
        "on-tertiary": "#ffffff",
        "secondary": "#006c49",
        "tertiary-container": "#b75b00",
        "surface-variant": "#d3e4fe",
        "on-error-container": "#93000a",
        "surface": "#f8f9ff",
        "on-primary-fixed-variant": "#004395",
        "inverse-surface": "#213145",
        "primary-fixed": "#d8e2ff",
        "on-primary-fixed": "#001a42",
        "surface-bright": "#f8f9ff",
        "surface-container-lowest": "#ffffff",
        "error-container": "#ffdad6",
        "secondary-fixed-dim": "#4edea3",
        "outline": "#727785",
        "surface-container-high": "#dce9ff",
        "on-surface": "#0b1c30",
        "surface-tint": "#005ac2",
        "surface-container-low": "#eff4ff",
        "on-tertiary-container": "#fffbff",
        "primary-container": "#2170e4",
        "inverse-on-surface": "#eaf1ff",
        "primary": "#0058be",
        "secondary-fixed": "#6ffbbe",
        "on-background": "#0b1c30",
        "on-primary-container": "#fefcff",
        "on-error": "#ffffff",
        "on-tertiary-fixed": "#311400",
        "secondary-container": "#6cf8bb",
        "on-secondary": "#ffffff",
        "surface-dim": "#cbdbf5",
        "primary-fixed-dim": "#adc6ff",

        // Aliases for legacy refactored pages
        'surface-card': '#ffffff', // surface-container-lowest
        'primary-hover': '#004395', // on-primary-fixed-variant
        'primary-text': '#ffffff', // on-primary
        'secondary-text': '#00714d', // on-secondary-container
        accent: '#924700', // tertiary
        'text-main': '#0b1c30', // on-surface
        'text-muted': '#424754', // on-surface-variant
        'outline-muted': '#c2c6d6', // outline-variant
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px",
        "card": "16px", // legacy
      },
      spacing: {
        "margin-mobile": "16px",
        "lg": "48px",
        "base": "8px",
        "xs": "4px",
        "sm": "12px",
        "xl": "80px",
        "gutter": "24px",
        "container-max": "1280px",
        "md": "24px",
        'section': '80px', // legacy
      },
      fontFamily: {
        "body-sm": ["var(--font-inter)", "sans-serif"],
        "headline-lg": ["var(--font-montserrat)", "sans-serif"],
        "body-md": ["var(--font-inter)", "sans-serif"],
        "label-md": ["var(--font-inter)", "sans-serif"],
        "label-sm": ["var(--font-inter)", "sans-serif"],
        "headline-sm": ["var(--font-montserrat)", "sans-serif"],
        "display": ["var(--font-montserrat)", "sans-serif"],
        "headline-md": ["var(--font-montserrat)", "sans-serif"],
        "headline-lg-mobile": ["var(--font-montserrat)", "sans-serif"],
        "body-lg": ["var(--font-inter)", "sans-serif"],
        
        // Legacy
        heading: ["var(--font-montserrat)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        "body-sm": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
        "headline-lg": ["32px", {"lineHeight": "1.2", "fontWeight": "600"}],
        "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "label-md": ["14px", {"lineHeight": "1", "letterSpacing": "0.01em", "fontWeight": "600"}],
        "label-sm": ["12px", {"lineHeight": "1", "fontWeight": "500"}],
        "headline-sm": ["20px", {"lineHeight": "1.4", "fontWeight": "600"}],
        "display": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "headline-md": ["24px", {"lineHeight": "1.3", "fontWeight": "600"}],
        "headline-lg-mobile": ["24px", {"lineHeight": "1.2", "fontWeight": "600"}],
        "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
      },
      boxShadow: {
        'level-1': '0 4px 12px 0 rgba(0, 0, 0, 0.04)',
        'level-2': '0 8px 24px 0 rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
