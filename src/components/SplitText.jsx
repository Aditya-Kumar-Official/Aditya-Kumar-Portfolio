import { m } from 'framer-motion';

/* Splits text into characters that rise out of a clipped line, one after another.
   The visible characters are aria-hidden; the wrapper carries the full string for screen readers.
   The overflow-hidden mask + small bottom padding stop descenders (g, y) being clipped.

   `gradient`: background-clip:text cannot paint through children that are transformed, so each
   character carries the gradient itself. Each one is sized to the whole word and offset by its
   index, so the letters line up as one continuous gradient instead of repeating per letter. */
export default function SplitText({ text, start, delay = 0, stagger = 0.035, gradient = false, className = '' }) {
  const chars = [...text];
  return (
    <span className={`block overflow-hidden pb-[0.1em] -mb-[0.1em] ${className}`}>
      <span className="sr-only">{text}</span>
      {chars.map((ch, i) => (
        <m.span
          key={i} aria-hidden="true" className={`inline-block will-change-transform ${gradient ? 'text-gradient' : ''}`}
          style={gradient ? { backgroundSize: `${chars.length * 100}% 100%`, backgroundPosition: `${(i / Math.max(chars.length - 1, 1)) * 100}% 0` } : undefined}
          initial={{ y: '110%' }} animate={start ? { y: 0 } : { y: '110%' }}
          transition={{ duration: 0.8, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
        >{ch === ' ' ? '\u00a0' : ch}</m.span>
      ))}
    </span>
  );
}
