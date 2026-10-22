import { useRef } from 'react';
import { prefersReducedMotion } from '../lib/scroll.js';

/* Wraps a button/link so it leans toward the pointer while hovered ("magnetic" hover).
   `strength` is the fraction of the pointer offset applied. No-op on touch and reduced motion.
   The element's own click target is unchanged; only a CSS transform moves. */
export default function Magnetic({ children, strength = 0.28, className = '' }) {
  const ref = useRef(null);
  const enabled = () => !prefersReducedMotion() && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const move = (e) => {
    if (!enabled()) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * strength;
    const dy = (e.clientY - (r.top + r.height / 2)) * strength;
    ref.current.style.transition = 'transform .08s linear';
    ref.current.style.transform = `translate3d(${dx}px,${dy}px,0)`;
  };
  const reset = () => {
    if (!ref.current) return;
    ref.current.style.transition = 'transform .5s cubic-bezier(.22,1.4,.36,1)'; // springy return
    ref.current.style.transform = 'translate3d(0,0,0)';
  };
  return <span ref={ref} onPointerMove={move} onPointerLeave={reset} className={`inline-block ${className}`}>{children}</span>;
}
