import { useEffect, useState } from 'react';
import { ArrowDownRight, Download } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { Mail } from 'lucide-react';
import { m } from 'framer-motion';
import { profile } from '../data/site.js';
import { useTyping } from '../hooks/useTyping.js';
import { scrollToId } from '../lib/scroll.js';
import Magnetic from '../components/Magnetic.jsx';
import HeroVisual from '../components/HeroVisual.jsx';
import SplitText from '../components/SplitText.jsx';

/* `ready` flips true when the preloader has left, so the headline animation is seen, not missed. */
/* One map instance only: positioned diagram on lg+, a compact ordered flow below it (no duplicate DOM). */
const useIsDesktop = () => {
  const q = '(min-width: 1024px)';
  const [on, setOn] = useState(() => window.matchMedia(q).matches);
  useEffect(() => { const mq = window.matchMedia(q); const f = () => setOn(mq.matches); mq.addEventListener('change', f); return () => mq.removeEventListener('change', f); }, []);
  return on;
};

export default function Hero({ ready }) {
  const desktop = useIsDesktop();
  const role = useTyping(profile.roles, { active: ready });
  const fade = (delay) => ({ initial: { opacity: 0, y: 14 }, animate: ready ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] } });

  return (
    <section id="home" aria-labelledby="hero-title" className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28">
      {desktop && <HeroVisual />}
      {/* soft vignette keeps text readable over the visual */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 30% 55%, rgb(var(--bg) / .75), transparent 70%)' }} />

      <div className="wrap relative">
        <m.p {...fade(0.1)} className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted hairline border glass !shadow-none">
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" /> Open to {profile.target}
        </m.p>

        <h1 id="hero-title" className="text-display font-bold">
          <SplitText text="Aditya" start={ready} delay={0.05} />
          <SplitText text="Kumar" start={ready} delay={0.25} gradient />
        </h1>

        {/* fixed min-height so the typing effect never shifts the layout below it */}
        <m.p {...fade(0.9)} className="mt-6 min-h-[2.25rem] font-display text-h3 text-ink">
          <span className="sr-only">{profile.roles.join(', ')}</span>
          <span aria-hidden="true">{role}<span className="caret ml-0.5 inline-block w-[0.1em] translate-y-[0.08em] bg-accent" style={{ height: '1em' }} /></span>
        </m.p>
        <m.p {...fade(1.0)} className="mt-4 max-w-xl text-lead text-muted">{profile.positioning} {profile.intro}</m.p>

        <m.div {...fade(1.15)} className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic><button type="button" className="btn btn-primary" onClick={() => scrollToId('projects')}>View work <ArrowDownRight size={18} aria-hidden="true" /></button></Magnetic>
          <Magnetic><a className="btn btn-ghost" href={profile.resumeUrl} download="Aditya_Kumar_Resume.pdf">Download resume <Download size={17} aria-hidden="true" /></a></Magnetic>
        </m.div>

        <m.ul {...fade(1.3)} className="mt-10 flex items-center gap-2" aria-label="Social links">
          {[
            { href: profile.githubUrl, label: 'GitHub (opens in a new tab)', Icon: FaGithub, ext: true },
            { href: profile.linkedinUrl, label: 'LinkedIn (opens in a new tab)', Icon: FaLinkedin, ext: true },
            { href: `mailto:${profile.email}`, label: `Email ${profile.email}`, Icon: Mail }
          ].map(({ href, label, Icon, ext }) => (
            <li key={label}><a href={href} aria-label={label} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="grid h-11 w-11 place-items-center rounded-full text-muted transition-colors hover:text-ink hairline border"><Icon size={18} aria-hidden="true" /></a></li>
          ))}
        </m.ul>

        {!desktop && <m.div {...fade(1.45)}><HeroVisual compact /></m.div>}
      </div>
    </section>
  );
}
