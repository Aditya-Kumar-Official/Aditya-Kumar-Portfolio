import { useEffect, useRef } from 'react';
import { m } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, X } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { lockScroll, unlockScroll } from '../lib/scroll.js';
import ProjectImage from './ProjectImage.jsx';

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])';

/* Case study as an accessible modal: role=dialog, labelled, Esc + backdrop close, scroll locked,
   Tab trapped inside, focus returned to the card that opened it.
   Structure follows the brief: problem -> approach -> architecture -> result. */
export default function CaseStudyModal({ project, onClose }) {
  const box = useRef(null);
  const opener = useRef(document.activeElement);

  useEffect(() => {
    lockScroll('modal');
    box.current?.querySelector('[data-close]')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
      if (e.key !== 'Tab') return;
      const items = [...box.current.querySelectorAll(FOCUSABLE)];
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); unlockScroll('modal'); opener.current?.focus?.(); };
  }, [onClose]);

  const label = (t) => <h3 className="mb-3 font-display text-lg font-semibold">{t}</h3>;

  return (
    <m.div className="fixed inset-0 z-[110] overflow-y-auto bg-black/70 px-4 py-[6vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()} data-lenis-prevent>
      <m.article ref={box} role="dialog" aria-modal="true" aria-labelledby="case-title" className="glass mx-auto w-full max-w-3xl !bg-surface/95 p-6 sm:p-10"
        initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.25 }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted">{project.category} &middot; {project.status} &middot; {project.year}</p>
            <h2 id="case-title" className="mt-2 text-h2 font-semibold">{project.name}</h2>
          </div>
          <button data-close type="button" onClick={onClose} aria-label="Close case study" className="grid h-11 w-11 shrink-0 place-items-center rounded-full hairline border"><X size={18} aria-hidden="true" /></button>
        </div>
        <p className="mt-4 text-lead text-muted">{project.summary}</p>

        <div className="mt-8 overflow-hidden rounded-xl hairline border">
          <ProjectImage image={project.image} sizes="(max-width: 768px) 92vw, 720px" eager />
        </div>

        <div className="mt-10 space-y-10">
          <section aria-labelledby="cs-problem">{label('Problem')}<p id="cs-problem" className="text-muted">{project.problem}</p></section>
          <section>{label('Approach')}
            <p className="mb-3 text-sm text-muted">My role: <span className="text-ink">{project.role}</span></p>
            <ul className="space-y-3 text-muted">{project.approach.map((a) => <li key={a} className="flex gap-3"><ArrowRight size={16} className="mt-1 shrink-0 text-accent" aria-hidden="true" />{a}</li>)}</ul>
          </section>
          <section>{label('Architecture')}
            <ol className="flex flex-col items-stretch gap-2 md:flex-row md:flex-wrap md:items-center">
              {project.architecture.map((n, i) => (
                <li key={n} className="flex items-center gap-2 md:gap-2">
                  <span className="glass flex-1 !rounded-xl px-4 py-2.5 text-center text-sm font-medium">{n}</span>
                  {i < project.architecture.length - 1 && <ArrowRight size={16} className="hidden shrink-0 text-accent md:block" aria-hidden="true" />}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-muted">High-level flow, based on the project&rsquo;s described architecture.</p>
          </section>
          <section>{label('What it delivers')}
            <ul className="grid gap-2 sm:grid-cols-2">{project.delivers.map((f) => <li key={f} className="flex items-center gap-2 text-muted"><Check size={16} className="shrink-0 text-accent" aria-hidden="true" />{f}</li>)}</ul>
          </section>
          <section>{label('Tech stack')}<ul className="flex flex-wrap gap-2">{project.stack.map((s) => <li key={s} className="chip">{s}</li>)}</ul></section>
        </div>

        {(project.liveUrl || project.repos?.length > 0) && (
          <div className="mt-10 flex flex-wrap gap-3">
            {project.liveUrl && <a className="btn btn-primary" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live demo <ArrowUpRight size={17} aria-hidden="true" /></a>}
            {project.repos?.map((r) => <a key={r.url} className="btn btn-ghost" href={r.url} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} ${r.label} (opens in a new tab)`}><FaGithub size={17} aria-hidden="true" /> {r.label}</a>)}
          </div>
        )}
      </m.article>
    </m.div>
  );
}
