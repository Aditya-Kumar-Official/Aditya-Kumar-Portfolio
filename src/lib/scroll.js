/* Smooth scrolling (Lenis) + one programmatic API for the whole site.
   Lenis is imported dynamically so it never blocks first paint, and it is skipped entirely
   for users who prefer reduced motion (native scrolling is used instead). */
let lenis = null;
const locks = new Set();

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Returns a synchronous cleanup. Each call owns at most one Lenis instance, and a call that was
   cleaned up before the dynamic import resolved never creates one. This matters in dev, where React
   StrictMode runs effects twice: the old async version could leave an orphaned instance that
   intercepted wheel events but was never ticked, which froze page scrolling. */
export function initSmoothScroll() {
  if (prefersReducedMotion()) return () => {};
  let cancelled = false, mine = null, raf = 0;
  import('lenis').then(({ default: Lenis }) => {
    if (cancelled || lenis) return;
    mine = lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    const loop = (t) => { mine.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    if (locks.size) mine.stop();   // a lock (preloader, modal) was taken before Lenis finished loading
  });
  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
    if (mine) { mine.destroy(); if (lenis === mine) lenis = null; mine = null; }
  };
}

/* Scroll to a section id ('home' = top). The offset matches the fixed header height. */
export function scrollToId(id) {
  const el = id === 'home' ? document.body : document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(id === 'home' ? 0 : el, { offset: id === 'home' ? 0 : -72, duration: 1.2 });
  else window.scrollTo({ top: id === 'home' ? 0 : el.getBoundingClientRect().top + window.scrollY - 72, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  if (id !== 'home') history.replaceState(null, '', `#${id}`); else history.replaceState(null, '', location.pathname);
}

/* Freeze / release page scroll (preloader, modals, mobile menu, palette).
   Locks are keyed and idempotent: releasing the same key twice is harmless, so a component can
   release *before* it triggers navigation (Lenis ignores scrollTo while stopped) and again in its cleanup. */
export function lockScroll(key) {
  locks.add(key);
  lenis?.stop(); document.documentElement.style.overflow = 'hidden';
}
export function unlockScroll(key) {
  locks.delete(key);
  if (locks.size === 0) { lenis?.start(); document.documentElement.style.overflow = ''; }
}
