import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Geist"', '"Geist Fallback"', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', '"Geist Mono Fallback"', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#06b6d4',
          hover: '#0891b2',
          light: '#a5f3fc',
          dark: '#083344',
        },
        surface: '#101215',
        sunken: '#0c0d0f',
        border: '#2A2D33',
        bg: '#0A0B0D',
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
      },
      spacing: {
        '18': '72px',
        '22': '88px',
      },
    },
  },
  plugins: [],
};

export default config;
