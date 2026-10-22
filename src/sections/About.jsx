import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { about, statsConfig } from '../data/site.js';
import { useCountUp } from '../hooks/useCountUp.js';
import { RevealGroup, RevealItem } from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';

function Stat({ stat, inView }) {
  const counts = stat.value !== undefined;
  const n = useCountUp(counts ? stat.value : 0, { start: inView && counts, decimals: stat.decimals ?? 0 });
  return (
    <div className="glass h-full p-5">
      <p className="font-display text-xl font-semibold tabular-nums text-balance sm:text-2xl">
        {counts ? (
          <>
            <span aria-hidden="true">{n}</span><span className="sr-only">{stat.value.toFixed(stat.decimals)}</span>
            {stat.suffix && <span className="ml-1 text-base text-muted">{stat.suffix}</span>}
          </>
        ) : stat.text}
      </p>
      <p className="mt-2 text-sm text-muted">{stat.label}</p>
    </div>
  );
}

export default function About() {
  const statsRef = useRef(null);
  const inView = useInView(statsRef, { once: true, amount: 0.4 });
  return (
    <section id="about" aria-labelledby="about-title" className="section">
      <div className="wrap">
        <SectionHeading id="about-title" title="Curiosity first, then craft." note="I like understanding how things work, then making them work better." />
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-20">
          {/* photo: hover lifts the colour and tilts the frame slightly (desktop pointers only) */}
          <figure className="group mx-auto w-full max-w-xs lg:mx-0" data-cursor>
            <div className="glass overflow-hidden !rounded-3xl p-2 transition-transform duration-500 [@media(hover:hover)]:group-hover:-rotate-1 [@media(hover:hover)]:group-hover:scale-[1.02]">
              <picture>
                <source type="image/webp" srcSet="/profile-480.webp 480w, /profile-840.webp 840w" sizes="(max-width: 1024px) 320px, 320px" />
                <img src="/profile-840.webp" alt={about.photo.alt} width={about.photo.width} height={about.photo.height} loading="lazy" decoding="async"
                  className="aspect-[4/5] w-full rounded-[1.25rem] object-cover object-top grayscale-[35%] transition-[filter] duration-500 [@media(hover:hover)]:group-hover:grayscale-0" />
              </picture>
            </div>
          </figure>

          <div>
            <p className="max-w-2xl text-lead font-medium">{about.lead}</p>
            {about.body.map((p) => <p key={p} className="mt-5 max-w-2xl text-muted">{p}</p>)}
            <div ref={statsRef}>
              <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 [&>*]:h-full" stagger={0.1}>
                {statsConfig.map((s) => <RevealItem key={s.id}><Stat stat={s} inView={inView} /></RevealItem>)}
              </RevealGroup>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
