/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        xs: '0 1px 2px rgba(15, 32, 55, 0.04)',
        card: '0 1px 3px rgba(15, 32, 55, 0.06), 0 1px 2px rgba(15, 32, 55, 0.04)',
        'card-hover': '0 12px 28px -8px rgba(15, 32, 55, 0.16), 0 4px 10px -4px rgba(15, 32, 55, 0.08)',
        popover: '0 24px 48px -12px rgba(10, 22, 40, 0.28)',
        glow: '0 0 0 1px rgba(2, 132, 199, 0.15), 0 8px 24px -6px rgba(2, 132, 199, 0.35)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-up': {
          from: { opacity: '0', transform: 'scale(0.96) translateY(4px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'soft-pulse': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 0 rgba(244, 63, 94, 0))' },
          '50%': { opacity: '0.85', filter: 'drop-shadow(0 0 6px rgba(244, 63, 94, 0.55))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out forwards',
        'scale-up': 'scale-up 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'soft-pulse': 'soft-pulse 1.8s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};
