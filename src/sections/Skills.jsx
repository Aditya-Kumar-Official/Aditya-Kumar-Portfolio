import { useId } from 'react';
import { skillGroups } from '../data/site.js';
import { TechMark } from '../components/TechIcon.jsx';
import { RevealGroup, RevealItem } from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';

const all = skillGroups.flatMap((g) => g.items);

/* The scrolling strip: the list is rendered twice and translated -50%, so the loop is seamless.
   The duplicate is aria-hidden and unfocusable so screen readers hear each skill once. */
function Marquee() {
  const row = (hidden) => all.map((s) => (
    <li key={(hidden ? 'b-' : 'a-') + s.name} aria-hidden={hidden || undefined} className="flex items-center gap-3 whitespace-nowrap font-display text-lg text-muted">
      <TechMark name={s.name} fallback={s.mark} size={22} /> {s.name}
    </li>
  ));
  return (
    <div className="marquee-mask overflow-hidden border-y hairline py-5" role="group" aria-label="Technologies I work with">
      <ul className="marquee-track animate-marquee flex w-max gap-12 pr-12">{row(false)}{row(true)}</ul>
    </div>
  );
}

/* A skill chip. Description appears as a tooltip on hover AND keyboard focus (and on tap, since
   tapping focuses it). It is wired with aria-describedby so screen readers get the same text. */
function Skill({ skill }) {
  const tipId = useId();
  const used = skill.projects.length ? `Used in ${skill.projects.map((id) => (id === 'satquery' ? 'SatQuery AI' : 'LifeLink')).join(' and ')}.` : null;
  return (
    <li tabIndex={0} aria-describedby={tipId} className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm outline-offset-2 ${skill.name.length > 16 ? 'col-span-full' : ''} transition-colors hover:bg-ink/5 focus-visible:bg-ink/5`}>
      <TechMark name={skill.name} fallback={skill.mark} size={20} />
      <span className="font-medium">{skill.name}</span>
      {skill.projects.length > 0 && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />}
      <span id={tipId} role="tooltip" className="glass pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 translate-y-1 !rounded-xl px-3 py-2 text-left text-xs leading-relaxed text-muted opacity-0 transition duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        {skill.description}{used && <span className="mt-1 block text-accent">{used}</span>}
      </span>
    </li>
  );
}

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="section">
      <div className="wrap">
        <SectionHeading id="skills-title" title="The toolkit behind the work." note="Grouped by what each tool does. A dot marks technologies used in a featured project; hover or focus any item for details." />
      </div>
      <Marquee />
      <div className="wrap mt-12">
        <RevealGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {skillGroups.map((g) => (
            <RevealItem key={g.id} as="section" aria-labelledby={`g-${g.id}`} className="glass p-5">
              <h3 id={`g-${g.id}`} className="mb-3 px-3 text-base font-semibold">{g.label}</h3>
              <ul className="grid grid-cols-1 gap-0.5 min-[420px]:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">{g.items.map((s) => <Skill key={s.name} skill={s} />)}</ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
