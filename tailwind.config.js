/** Design tokens live as CSS variables (src/index.css) so the light/dark switch is one attribute.
 *  Tailwind just maps names to them. Spacing: Tailwind's scale is a 4px grid; the layout uses
 *  even steps only (2 = 8px, 4 = 16px, 6 = 24px, 8 = 32px, 12 = 48px, 16 = 64px ...). */
const rgb = (name) => `rgb(var(--${name}) / <alpha-value>)`;
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: rgb('bg'), surface: rgb('surface'), ink: rgb('ink'), muted: rgb('muted'),
        line: rgb('line'), accent: rgb('accent-text'), 'accent-from': rgb('accent-from'), 'accent-to': rgb('accent-to')
      },
      fontFamily: {
        display: ['"Space Grotesk Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      // Fluid type scale: min at 360px viewport, max at ~1440px.
      fontSize: {
        display: ['clamp(3rem, 1.4rem + 7vw, 7.25rem)', { lineHeight: '0.95', letterSpacing: '-0.035em' }],
        h2: ['clamp(2rem, 1.3rem + 2.8vw, 3.75rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        h3: ['clamp(1.25rem, 1.1rem + 0.6vw, 1.75rem)', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        lead: ['clamp(1.0625rem, 1rem + 0.4vw, 1.3125rem)', { lineHeight: '1.6' }]
      },
      maxWidth: { page: '72rem' },
      boxShadow: { glass: '0 1px 0 rgb(255 255 255 / 0.06) inset, 0 24px 64px -24px rgb(0 0 0 / 0.55)' },
      keyframes: {
        marquee: { to: { transform: 'translateX(-50%)' } },
        drift: { '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' }, '50%': { transform: 'translate3d(4%,-6%,0) scale(1.12)' } }
      },
      animation: { marquee: 'marquee 38s linear infinite', drift: 'drift 22s ease-in-out infinite' }
    }
  },
  plugins: []
};
