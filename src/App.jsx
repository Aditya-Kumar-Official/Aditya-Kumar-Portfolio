import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, LazyMotion } from 'framer-motion';
import { useTheme } from './hooks/useTheme.js';
import { initSmoothScroll, prefersReducedMotion } from './lib/scroll.js';
import Cursor from './components/Cursor.jsx';
import Footer from './components/Footer.jsx';
import Nav from './components/Nav.jsx';
import Preloader from './components/Preloader.jsx';
import Hero from './sections/Hero.jsx';

/* Everything below the fold is code-split. The imports are also kicked off right after mount
   (see prefetch) so anchor links and the command palette never wait on a chunk. */
const loaders = {
  About: () => import('./sections/About.jsx'),
  Skills: () => import('./sections/Skills.jsx'),
  Projects: () => import('./sections/Projects.jsx'),
  Experience: () => import('./sections/Experience.jsx'),
  Contact: () => import('./sections/Contact.jsx'),
  Palette: () => import('./components/CommandPalette.jsx')
};
const About = lazy(loaders.About), Skills = lazy(loaders.Skills), Projects = lazy(loaders.Projects),
  Experience = lazy(loaders.Experience), Contact = lazy(loaders.Contact), CommandPalette = lazy(loaders.Palette);

/* Preloader shows once per browser session (sessionStorage), so reloads and revisits in the same tab skip it.
   Reduced-motion visitors skip it too. */
const shouldShowLoader = () => {
  if (prefersReducedMotion()) return false;
  try { return sessionStorage.getItem('ak-loaded') !== '1'; } catch { return true; }
};

const loadMotionFeatures = () => import('./lib/motionFeatures.js').then((mod) => mod.default);

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [loading, setLoading] = useState(shouldShowLoader);
  const [revealed, setRevealed] = useState(!loading);   // flips as the loader panels start to open, so the headline reveal is seen through the gap
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const cleanupScroll = initSmoothScroll();
    // Prefetch the lazy chunks one per idle slot so no single task evaluates them all at once.
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
    const queue = Object.values(loaders);
    const next = () => { const load = queue.shift(); if (!load || cancelled) return; load().finally(() => idle(next, { timeout: 1500 })); };
    idle(next, { timeout: 1500 });
    return () => { cancelled = true; cleanupScroll(); };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPaletteOpen((o) => !o); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const finishLoading = useCallback(() => {
    try { sessionStorage.setItem('ak-loaded', '1'); } catch { /* ignore */ }
    setLoading(false);
  }, []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      {/* atmosphere */}
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
      <div className="grain" aria-hidden="true" />
      <Cursor />

      <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[300] rounded-full bg-ink px-5 py-3 font-semibold text-bg">Skip to content</a>
      <Nav theme={theme} onToggleTheme={toggleTheme} onOpenPalette={() => setPaletteOpen(true)} />

      <main id="main">
        <Hero ready={revealed} />
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <About /><Skills /><Projects /><Experience /><Contact />
        </Suspense>
      </main>
      <Footer />

      <AnimatePresence>
        {paletteOpen && <Suspense fallback={null}><CommandPalette onClose={closePalette} theme={theme} onToggleTheme={toggleTheme} /></Suspense>}
      </AnimatePresence>
      {loading && <Preloader onDone={finishLoading} onExit={() => setRevealed(true)} />}
    </LazyMotion>
  );
}
