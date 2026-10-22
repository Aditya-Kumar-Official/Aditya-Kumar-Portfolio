import { useEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';
import { lockScroll, unlockScroll } from '../lib/scroll.js';

const MIN_MS = 2000;      // minimum time on screen, per the brief
const MAX_MS = 8000;      // failsafe: never trap a visitor if an asset hangs
const STATUS = ['Loading fonts\u2026', 'Loading images\u2026', 'Ready'];

/* Real work the percentage is tied to. Each task resolves (success OR failure) exactly once. */
const loadImage = (src) => new Promise((res) => { const i = new Image(); i.onload = i.onerror = res; i.src = src; });
const TASKS = [
  () => document.fonts?.ready ?? Promise.resolve(),
  () => (document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => window.addEventListener('load', r, { once: true }))),
  () => loadImage('/profile-480.webp'),
  () => loadImage('/projects/satquery-800.webp')
];

/* Block-letter "AK" as closed outlines. pathLength="1" lets one CSS dash animation draw any path. */
function Mark() {
  return (
    <svg viewBox="-4 -4 156 96" className="h-24 w-auto sm:h-28" role="img" aria-label="AK" fill="url(#ak-grad)">
      <defs>
        <linearGradient id="ak-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b9bff" /><stop offset=".55" stopColor="#a855f7" /><stop offset="1" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      <g stroke="url(#ak-grad)" strokeWidth="2.2" strokeLinejoin="round" fillRule="evenodd">
        <path className="ak-stroke" pathLength="1" d="M10 80 34 8H46L70 80H56L52 68H28L24 80ZM32 56H48L40 30Z" />
        <path className="ak-stroke" pathLength="1" d="M84 8H98V38L122 8H139L111 42 141 80H124L98 50V80H84Z" />
      </g>
    </svg>
  );
}

function Glow({ half }) {
  /* Each half renders the full-screen backdrop at 200% height and shows its own half, so the glow
     splits seamlessly when the panels slide apart. */
  return (
    <div className={`absolute inset-x-0 h-[200%] bg-[#07080f] ${half === 'top' ? 'top-0' : 'bottom-0'}`}>
      {/* radial gradients instead of blur() filters: same soft glow, a fraction of the paint cost */}
      <div className="loader-glow-a absolute left-[2%] top-[12%] h-[85vmin] w-[85vmin] rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(79,91,213,.55), transparent)' }} />
      <div className="loader-glow-b absolute bottom-[8%] right-[2%] h-[80vmin] w-[80vmin] rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(168,85,247,.42), transparent)' }} />
    </div>
  );
}

export default function Preloader({ onDone, onExit }) {
  const [pct, setPct] = useState(0);
  const [exiting, setExiting] = useState(false);
  const bar = useRef(null);
  const real = useRef(0);   // fraction of real tasks finished
  const done = useRef(false);

  useEffect(() => {
    lockScroll('preloader');
    let finished = 0;
    TASKS.forEach((run) => Promise.resolve().then(run).catch(() => {}).then(() => { finished += 1; real.current = finished / TASKS.length; }));
    const t0 = performance.now();
    let shown = 0, raf, last = t0;
    const tick = (now) => {
      const elapsed = now - t0;
      const dt = now - last; last = now;
      // Never ahead of reality OR of the 2s clock, so 100% means "loaded AND shown long enough".
      const target = Math.min(real.current, elapsed / MIN_MS) * 100;
      const forced = elapsed > MAX_MS ? 100 : target;
      // Time-based easing (not per-frame), so slow devices still reach 100 on schedule.
      shown += (forced - shown) * (1 - Math.exp(-dt / 140));
      if (forced - shown < 0.6) shown = forced;
      const whole = Math.round(shown);
      if (bar.current) bar.current.style.transform = `scaleX(${shown / 100})`; // no React render per frame
      setPct((prev) => (prev === whole ? prev : whole)); // re-render only when the visible number changes
      if (shown >= 100 && !done.current) { done.current = true; setTimeout(() => { setExiting(true); onExit?.(); }, 350); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); unlockScroll('preloader'); };
  }, []);

  const status = STATUS[pct < 35 ? 0 : pct < 78 ? 1 : 2];
  const ease = [0.76, 0, 0.24, 1];

  return (
    <div className="fixed inset-0 z-[200]" role="progressbar" aria-label="Loading portfolio" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
      {/* two panels: slide up / down on exit */}
      <m.div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden" initial={{ y: 0 }} animate={{ y: exiting ? '-100%' : 0 }} transition={{ duration: 0.95, ease }}>
        <Glow half="top" />
      </m.div>
      <m.div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden" initial={{ y: 0 }} animate={{ y: exiting ? '100%' : 0 }} transition={{ duration: 0.95, ease }}
        onAnimationComplete={() => { if (exiting) onDone(); }}>
        <Glow half="bottom" />
      </m.div>

      <m.div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center" animate={{ opacity: exiting ? 0 : 1, scale: exiting ? 0.96 : 1 }} transition={{ duration: 0.4 }}>
        <Mark />
        <div className="w-56 sm:w-72">
          <div className="h-px w-full overflow-hidden bg-white/15">
            <div ref={bar} className="h-full origin-left bg-gradient-to-r from-[#8b9bff] via-[#a855f7] to-[#f472b6]" style={{ transform: 'scaleX(0)' }} />
          </div>
          <div className="mt-4 flex items-baseline justify-between font-display text-sm text-[#9aa0bd]">
            <span aria-hidden="true">{status}</span>
            <span className="tabular-nums text-[#eceefb]" aria-hidden="true">{String(pct).padStart(3, '0')}%</span>
          </div>
        </div>
      </m.div>
    </div>
  );
}
