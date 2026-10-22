import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/scroll.js';

/* Custom cursor: a dot that tracks the pointer exactly + a ring that trails it (lerp).
   Only mounted for fine pointers (mouse/trackpad); touch and reduced-motion users get the native cursor.
   Positions are written straight to element styles in a rAF loop, so it never triggers a React render. */
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine || prefersReducedMotion()) return undefined;
    document.documentElement.classList.add('has-custom-cursor');
    let x = -100, y = -100, rx = -100, ry = -100, raf, hover = false, hidden = true;
    const onMove = (e) => {
      x = e.clientX; y = e.clientY;
      if (hidden) { rx = x; ry = y; hidden = false; dot.current.style.opacity = ring.current.style.opacity = '1'; }
      const t = e.target;
      const isText = t.closest?.('input, textarea');
      hover = !isText && !!t.closest?.('a, button, [role="button"], [data-cursor], summary, label');
      ring.current.dataset.hover = hover ? '1' : '0';
      ring.current.dataset.text = isText ? '1' : '0';
      dot.current.dataset.text = isText ? '1' : '0';
    };
    const onLeave = () => { hidden = true; dot.current.style.opacity = ring.current.style.opacity = '0'; };
    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[150] hidden [@media(hover:hover)_and_(pointer:fine)]:block">
      <div ref={ring} style={{ opacity: 0 }} className="absolute -left-5 -top-5 h-10 w-10 rounded-full border border-accent/70 transition-[width,height,left,top,background-color,opacity] duration-200 data-[hover='1']:-left-8 data-[hover='1']:-top-8 data-[hover='1']:h-16 data-[hover='1']:w-16 data-[hover='1']:bg-accent/10 data-[text='1']:opacity-0" />
      <div ref={dot} style={{ opacity: 0 }} className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-accent transition-opacity duration-200 data-[text='1']:opacity-0" />
    </div>
  );
}
