import { useRef } from 'react';
import { m, useScroll, useSpring } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { timeline } from '../data/site.js';
import SectionHeading from '../components/SectionHeading.jsx';

/* Scroll-linked progress line: `useScroll` reports how far the list has travelled through the
   viewport (0 to 1); a spring smooths it; the glowing line is scaled with a transform (no layout).
   The offsets make the line reach each dot as that item crosses the middle of the screen. */
export default function Experience() {
  const list = useRef(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 65%', 'end 55%'] });
  const grow = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });

  return (
    <section id="experience" aria-labelledby="exp-title" className="section">
      <div className="wrap">
        <SectionHeading id="exp-title" title="Learning in the field, with proof." note="Education, an internship, a job simulation, a course and industrial training, each with its original certificate." />
        <ol ref={list} className="relative ml-3 space-y-10 pl-8 md:ml-4 md:pl-12">
          {/* track + progress fill */}
          <span aria-hidden="true" className="absolute bottom-2 left-0 top-2 w-px" style={{ background: 'rgb(var(--line) / .14)' }} />
          <m.span aria-hidden="true" className="absolute bottom-2 left-0 top-2 w-px origin-top" style={{ scaleY: grow, background: 'linear-gradient(to bottom, rgb(var(--accent-from)), rgb(var(--accent-to)))', boxShadow: '0 0 12px rgb(var(--accent-to) / .8)' }} />

          {timeline.map((t) => (
            <m.li key={t.id} className="relative" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <m.span aria-hidden="true" className="absolute -left-[41px] top-7 h-3 w-3 rounded-full border-2 md:-left-[57px]"
                style={{ borderColor: 'rgb(var(--accent-text))', background: 'rgb(var(--bg))' }} whileInView={{ backgroundColor: 'rgb(139 155 255)' }} viewport={{ once: true, amount: 0.8 }} />
              <article className="glass grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-sm text-accent">{t.when}</p>
                  <h3 className="mt-2 text-h3 font-semibold">{t.title}</h3>
                  <p className="mt-1 font-medium">{t.org}</p>
                  <p className="mt-3 max-w-xl text-muted">{t.text}</p>
                  {t.cert && (
                    <a href={t.cert.pdf} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent underline-offset-4 hover:underline">
                      View original certificate (PDF, opens in a new tab) <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  )}
                  {t.cert?.verifyUrl && (
                    <a href={t.cert.verifyUrl} target="_blank" rel="noopener noreferrer" className="mt-3 block w-fit text-sm font-semibold text-accent underline-offset-4 hover:underline">
                      Verify credential on Credly (opens in a new tab) <ExternalLink size={14} aria-hidden="true" className="inline" />
                    </a>
                  )}
                </div>
                {t.cert && (
                  <a href={t.cert.pdf} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" data-cursor className="block w-full overflow-hidden rounded-xl hairline border md:w-64">
                    <img src={`${t.cert.base}-480.webp`} srcSet={`${t.cert.base}-480.webp 480w, ${t.cert.base}-960.webp 960w`} sizes="(max-width: 768px) 90vw, 256px"
                      alt="" width={t.cert.width} height={t.cert.height} loading="lazy" decoding="async" className="h-auto w-full transition-transform duration-500 hover:scale-[1.03]" />
                  </a>
                )}
              </article>
            </m.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
