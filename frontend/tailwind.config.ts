import type { Config } from 'tailwindcss';

// Colors are wired through CSS variables (defined per-theme in globals.css)
// rather than hardcoded hex values here. This means once real Figma colors
// are available, only globals.css needs updating — not this file, and not
// every component that uses e.g. `bg-primary`.
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  darkMode: ['class'], // toggled via a class on <html>, driven by ThemeProvider
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)',
        },
        danger: 'var(--color-danger)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
    },
  },
  plugins: [],
};

export default config;
