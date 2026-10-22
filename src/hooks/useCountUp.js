import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../lib/scroll.js';

/* Eases a number from 0 to `target` once `start` flips true. Reduced motion jumps to the end. */
export function useCountUp(target, { start, decimals = 0, duration = 1400 }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return undefined;
    if (prefersReducedMotion()) { setValue(target); return undefined; }
    let raf; const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setValue(target * (1 - Math.pow(1 - p, 3))); // easeOutCubic
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return value.toFixed(decimals);
}
