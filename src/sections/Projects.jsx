import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { projects } from '../data/site.js';
import ProjectImage from '../components/ProjectImage.jsx';
import SectionHeading from '../components/SectionHeading.jsx';

const CaseStudyModal = lazy(() => import('../components/CaseStudyModal.jsx'));

function Card({ project, onOpen }) {
  return (
    <m.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass group grid gap-0 overflow-hidden lg:grid-cols-[1.15fr_1fr]">
      <button type="button" onClick={() => onOpen(project)} tabIndex={-1} aria-hidden="true" data-cursor
        className="relative block overflow-hidden text-left [@media(hover:hover)]:hover:[&_img]:scale-[1.04]">
        <ProjectImage image={project.image} sizes="(max-width: 1024px) 92vw, 640px" className="transition-transform duration-700 ease-out" />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
      </button>
      <div className="flex flex-col p-6 sm:p-8">
        <p className="text-sm text-muted">{project.category} &middot; {project.status} &middot; {project.year}</p>
        <h3 className="mt-2 text-h3 font-semibold !text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)]">{project.name}</h3>
        <p className="mt-4 text-muted">{project.summary}</p>
        <p className="mt-4 text-sm text-muted">My role: <span className="text-ink">{project.role}</span></p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">{project.stack.map((t) => <li key={t} className="chip">{t}</li>)}</ul>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
          <button type="button" className="btn btn-primary" onClick={() => onOpen(project)}>Read case study <ArrowUpRight size={17} aria-hidden="true" /></button>
          {project.liveUrl && <a className="btn btn-ghost" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live demo <ArrowUpRight size={16} aria-hidden="true" /></a>}
          {project.repos?.map((r) => <a key={r.url} className="btn btn-ghost" href={r.url} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} ${r.label} (opens in a new tab)`}><FaGithub size={17} aria-hidden="true" /> {r.label}</a>)}
        </div>
      </div>
    </m.article>
  );
}

export default function Projects() {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);

  // The hero project map asks for a case study by project id. preventDefault() tells it the request was handled.
  useEffect(() => {
    const onOpen = (e) => {
      const p = projects.find((x) => x.id === e.detail?.id);
      if (!p) return;
      e.preventDefault();
      setOpen(p);
    };
    window.addEventListener('open-case-study', onOpen);
    return () => window.removeEventListener('open-case-study', onOpen);
  }, []);

  return (
    <section id="projects" aria-labelledby="projects-title" className="section">
      <div className="wrap">
        <SectionHeading id="projects-title" title="Projects with a point of view." note="Two case studies: what the problem was, what I built, and how the pieces fit together." />

        <div className="space-y-8">
          {projects.map((p) => <Card key={p.id} project={p} onOpen={setOpen} />)}
        </div>
      </div>

      <AnimatePresence>
        {open && <Suspense fallback={null}><CaseStudyModal project={open} onClose={close} /></Suspense>}
      </AnimatePresence>
    </section>
  );
}
