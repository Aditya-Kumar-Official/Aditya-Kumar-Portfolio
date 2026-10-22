import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { mapProjects } from '../data/systemMap.js';
import { scrollToId } from '../lib/scroll.js';

/* Hero "project map": pick a project, explore how its parts connect.
   - Data (labels, edges, copy) comes from data/systemMap.js, which reads site.js. It is a static,
     high-level architecture map, not live data, so there is deliberately no status/online indicator.
   - Hover or focus a component: its connections light up. Click / Enter / Space pins it; Esc or
     "Reset" releases it. Touch never depends on hover.
   - `compact` (below lg) swaps the positioned diagram for an ordered list with the same behaviour.
   - Pointer glow is rAF-throttled and written to CSS variables (no React re-render on move). */

const connected = (project, id) => project.edges.filter((e) => e.includes(id)).map((e) => e.find((x) => x !== id));

export default function HeroVisual({ compact = false }) {
  const root = useRef(null);
  const calm = useReducedMotion();
  const [pid, setPid] = useState(mapProjects[0].id);
  const [hover, setHover] = useState(null);
  const [pinned, setPinned] = useState(null);

  const project = mapProjects.find((p) => p.id === pid);
  const byId = Object.fromEntries(project.components.map((c) => [c.id, c]));
  const active = pinned ?? hover;
  const comp = active ? byId[active] : null;
  const links = comp ? connected(project, comp.id) : [];
  const linkedSet = new Set(comp ? [comp.id, ...links] : []);

  useEffect(() => {
    if (compact) return undefined;
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine || calm) return undefined;
    let raf = 0, ev = null;
    const apply = () => {
      raf = 0;
      const el = root.current;
      if (!el || !ev) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const clamp = (v) => Math.max(0, Math.min(100, v));
      el.style.setProperty('--mx', `${clamp(((ev.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${clamp(((ev.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
    };
    const onMove = (e) => { ev = e; if (!raf) raf = requestAnimationFrame(apply); };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, [compact, calm]);

  const choose = (id) => { setPid(id); setPinned(null); setHover(null); };
  const reset = () => { setPinned(null); setHover(null); };
  const onKeyDown = (e) => { if (e.key === 'Escape' && (pinned || hover)) { e.stopPropagation(); reset(); } };
  const pin = (id) => setPinned((p) => (p === id ? null : id));

  const openCaseStudy = () => {
    // Projects.jsx listens for this and opens the existing case-study modal. If it isn't mounted yet, scroll there.
    const handled = !window.dispatchEvent(new CustomEvent('open-case-study', { detail: { id: project.caseStudyId }, cancelable: true }));
    if (!handled) scrollToId('projects');
  };

  const nodeProps = (c) => {
    const to = connected(project, c.id).map((id) => byId[id].label).join(', ');
    return {
      type: 'button',
      'aria-pressed': pinned === c.id,
      'aria-label': `${c.label}, ${c.role}.${to ? ` Connected to ${to}.` : ''}`,
      onMouseEnter: () => setHover(c.id), onMouseLeave: () => setHover(null),
      onFocus: () => setHover(c.id), onBlur: () => setHover(null),
      onClick: () => pin(c.id)
    };
  };

  const renderEdges = () => (
    <svg aria-hidden="true" viewBox="0 0 100 80" className="absolute inset-0 h-full w-full">
      {project.edges.map(([a, b]) => {
        const A = byId[a], B = byId[b];
        const on = comp && (a === comp.id || b === comp.id);
        const y = (v) => v * 0.8;                                  // node y is in % of height; viewBox is 100x80
        const d = `M${A.x} ${y(A.y)} L${B.x} ${y(B.y)}`;
        return (
          <g key={a + b} style={{ opacity: comp && !on ? 0.3 : 1, transition: 'opacity .2s' }}>
            <path d={d} vectorEffect="non-scaling-stroke" className={on ? 'hero-edge hero-edge-on' : 'hero-edge'} />
            {!calm && (
              <circle r="0.9" className="hero-particle">
                <animateMotion dur={on ? '1.6s' : '3.6s'} repeatCount="indefinite" path={d} />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );

  return (
    <div className={compact ? 'relative mt-14 w-full max-w-xl' : 'pointer-events-none absolute right-[3%] top-1/2 z-10 w-[min(38vw,540px)] -translate-y-1/2'} onKeyDown={onKeyDown}>
      <div ref={root} className="hero-map pointer-events-auto relative p-3 sm:p-4">
        <div className="hero-map-glow absolute inset-0" aria-hidden="true" />

        {/* header: project switcher + honest static label */}
        <div className="relative flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div role="group" aria-label="Choose a project" className="flex flex-wrap gap-1.5">
            {mapProjects.map((p) => (
              <button key={p.id} type="button" aria-pressed={pid === p.id} onClick={() => choose(p.id)} className={`hero-tab ${pid === p.id ? 'hero-tab-on' : ''}`}>{p.name}</button>
            ))}
          </div>
        </div>
        <p className="relative mt-2 px-1 text-xs text-muted">Architecture map. Static and descriptive, not a live system.</p>

        {/* diagram (lg+) or ordered flow (below lg) */}
        <m.div key={project.id} className="relative mt-2" initial={calm ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} role="group" aria-label={`${project.name} architecture`}>
          {compact ? (
            <ol className="space-y-2 py-2">
              {project.components.map((c, i) => (
                <li key={c.id}>
                  <button {...nodeProps(c)} className={`hero-row ${pinned === c.id ? 'hero-row-on' : ''} ${comp && !linkedSet.has(c.id) ? 'opacity-60' : ''}`}>
                    <span aria-hidden="true" className="hero-row-num">{i + 1}</span>
                    <span className="min-w-0 text-left"><span className="block text-sm font-medium text-ink">{c.label}</span><span className="block text-xs text-muted">{c.role}</span></span>
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            <div className="relative aspect-[100/80] w-full">
              {renderEdges()}
              {project.components.map((c, i) => {
                const on = active === c.id, dim = comp && !linkedSet.has(c.id);
                return (
                  <button key={c.id} {...nodeProps(c)} className={`hero-node absolute p-2 ${on ? 'hero-node-on' : ''}`} style={{ left: `${c.x}%`, top: `${c.y}%`, opacity: dim ? 0.45 : 1 }}>
                    <span className="hero-node-face glass block whitespace-nowrap rounded-full px-3.5 py-2 text-[0.8125rem] font-medium leading-tight text-ink !shadow-none" style={{ animationDelay: `${-i * 1.1}s` }}>{c.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </m.div>

        {/* info panel */}
        <div role="status" aria-live="polite" className="relative mt-2 min-h-[8.5rem] rounded-2xl border px-4 py-3 text-sm hairline" style={{ background: 'rgb(var(--surface) / .6)' }}>
          <AnimatePresence mode="wait" initial={false}>
            <m.div key={project.id + (comp?.id ?? '')} initial={calm ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={calm ? undefined : { opacity: 0 }} transition={{ duration: 0.18 }}>
              {comp ? (
                <>
                  <p><span className="font-semibold text-ink">{comp.label}</span> <span className="text-muted">· {comp.role} · {project.name}</span></p>
                  <p className="mt-1 text-muted">{comp.detail}</p>
                  {links.length > 0 && <p className="mt-1 text-xs text-muted">Connects to: {links.map((id) => byId[id].label).join(', ')}</p>}
                </>
              ) : (
                <>
                  <p><span className="font-semibold text-ink">{project.name}</span> <span className="text-muted">· {project.status}</span></p>
                  <p className="mt-1 text-muted">{project.summary}</p>
                  {project.note && <p className="mt-1 text-xs text-muted">{project.note}</p>}
                  <p className="mt-1 text-xs text-muted">Select a component to see what it does.</p>
                </>
              )}
            </m.div>
          </AnimatePresence>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {project.caseStudyId && <button type="button" onClick={openCaseStudy} className="hero-action hero-action-primary">Case study <ArrowUpRight size={14} aria-hidden="true" /></button>}
            {project.liveUrl && <a className="hero-action" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live demo <ArrowUpRight size={14} aria-hidden="true" /></a>}
            {project.repos?.map((r) => <a key={r.url} className="hero-action" href={r.url} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} ${r.label} (opens in a new tab)`}><FaGithub size={14} aria-hidden="true" /> {r.label}</a>)}
            {pinned && <button type="button" onClick={reset} className="hero-action ml-auto"><RotateCcw size={13} aria-hidden="true" /> Reset</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
