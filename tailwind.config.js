/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        monad: {
          purple: '#836EF9',
          dark: '#1a1a2e',
        },
        // Rastros palette (top-level: no conflicts with existing tokens)
        primary: '#2A5C3E',     // forest green
        accent: '#B8572C',      // terracotta
        background: '#F5F1E8',  // warm cream
        foreground: '#1A1A1A',
        warm: '#FF6B35',
        muted: '#A8A8A0',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
