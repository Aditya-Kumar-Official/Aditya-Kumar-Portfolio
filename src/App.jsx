import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Award, Check,
  Code2, Command, Copy, Download, ExternalLink, FolderGit2, GraduationCap, House, Layers3,
  Mail, Menu, Moon, Phone, Search, Sun, Terminal as TerminalIcon, User, Workflow, X, Wrench
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { profile, projects, skillGroups } from './data/portfolio.js';
import { TechMark } from './components/icons.jsx';

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: 'easeOut' } }
};

/* Single source of truth for section navigation: header, mobile menu, command palette. */
const NAV = [
  { id: 'about', label: 'About', Icon: User },
  { id: 'projects', label: 'Projects', Icon: FolderGit2 },
  { id: 'experience', label: 'Experience', Icon: Award },
  { id: 'skills', label: 'Skills', Icon: Wrench },
  { id: 'education', label: 'Education', Icon: GraduationCap },
  { id: 'contact', label: 'Contact', Icon: Mail }
];
const NAV_ALL = [{ id: 'home', label: 'Home', Icon: House }, ...NAV];
const SECTION_IDS = NAV_ALL.map(item => item.id);

const modifierKey = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '') ? '⌘' : 'Ctrl';

const readStoredTheme = () => {
  try {
    const saved = localStorage.getItem('ak-theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch { /* storage can be blocked (private mode); fall back to the system preference */ }
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true">AK<i /></span>;
}

function SectionHeading({ eyebrow, title, note }) {
  return <div className="section-heading">
    <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>
    {note && <p>{note}</p>}
  </div>;
}

function App() {
  const reduceMotion = useReducedMotion();
  const [theme, setTheme] = useState(readStoredTheme);
  const [activeSkill, setActiveSkill] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillSearch, setSkillSearch] = useState('');
  const [photoAvailable, setPhotoAvailable] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('Type help to see available commands.');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const progressRef = useRef(null);
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [formStatus, setFormStatus] = useState('');
  const [formState, setFormState] = useState('idle');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('ak-theme', theme); } catch { /* ignore blocked storage */ }
  }, [theme]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      setScrolled(window.scrollY > 8);
      // The active section is the last one whose top has passed ~35% of the viewport.
      const marker = window.innerHeight * 0.35;
      let current = SECTION_IDS[0];
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= marker) current = id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = SECTION_IDS[SECTION_IDS.length - 1];
      setActiveSection(current);
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const onKeys = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key?.toLowerCase() === 'k') {
        e.preventDefault(); setPaletteOpen(v => !v);
      }
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName) && !document.activeElement?.isContentEditable) {
        const search = document.querySelector('.skill-search input');
        if (search) { e.preventDefault(); search.focus(); }
      }
      if (e.key === 'Escape') {
        setPaletteOpen(false); setSelectedProject(null); setTerminalOpen(false); setSelectedSkill(null);
        setMobileMenu(open => { if (open) menuButtonRef.current?.focus(); return false; });
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('keydown', onKeys);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('keydown', onKeys);
    };
  }, []);

  // Mobile menu: close on outside press and when the viewport grows to the desktop layout.
  useEffect(() => {
    if (!mobileMenu) return undefined;
    const onPointerDown = (e) => { if (headerRef.current && !headerRef.current.contains(e.target)) setMobileMenu(false); };
    const onResize = () => { if (window.innerWidth > 900) setMobileMenu(false); };
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('resize', onResize);
    return () => { document.removeEventListener('pointerdown', onPointerDown); window.removeEventListener('resize', onResize); };
  }, [mobileMenu]);

  useEffect(() => {
    const dialog = paletteOpen
      ? document.querySelector('.command-palette')
      : selectedProject
        ? document.querySelector('.case-modal')
        : terminalOpen
          ? document.querySelector('.terminal-window')
          : null;
    if (!dialog) return;
    const focusable = () => [...dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    const first = focusable()[0];
    first?.focus();
    const trapTab = (event) => {
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };
    dialog.addEventListener('keydown', trapTab);
    return () => dialog.removeEventListener('keydown', trapTab);
  }, [paletteOpen, selectedProject, terminalOpen]);

  const allSkills = useMemo(() => {
    const list = activeSkill === 'all'
      ? skillGroups.flatMap(group => group.items)
      : (skillGroups.find(group => group.id === activeSkill)?.items || []);
    const query = skillSearch.trim().toLowerCase();
    return query
      ? list.filter(skill => `${skill.name} ${skill.category} ${skill.description}`.toLowerCase().includes(query))
      : list;
  }, [activeSkill, skillSearch]);
  const totalSkills = useMemo(() => skillGroups.reduce((count, group) => count + group.items.length, 0), []);
  const selectedSkillProjects = selectedSkill
    ? projects.filter(project => selectedSkill.projects.includes(project.id))
    : [];

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    setPaletteOpen(false); setMobileMenu(false);
  };

  // Real anchors keep middle-click / open-in-new-tab working; plain clicks scroll smoothly.
  const navClick = (id) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    goTo(id);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true); window.setTimeout(() => setCopied(false), 1500);
    } catch { window.location.href = `mailto:${profile.email}`; }
  };

  const runTerminal = (e) => {
    e.preventDefault();
    const command = terminalInput.trim().toLowerCase();
    const responses = {
      help: 'Available commands: help · projects · skills · contact · clear',
      projects: 'SatQuery AI — ongoing · LifeLink — 2026. Scroll to #projects for the case studies.',
      skills: 'React · Node.js · Express.js · MongoDB · FastAPI · Python · JavaScript',
      contact: `Email: ${profile.email} · Phone: ${profile.phone}`,
      clear: ''
    };
    setTerminalOutput(responses[command] ?? `Command not found: ${command || '(empty)'}. Type help.`);
    if (command === 'projects') goTo('projects');
    if (command === 'skills') goTo('skills');
    if (command === 'contact') goTo('contact');
    setTerminalInput('');
  };

  const submitContact = async (e) => {
    e.preventDefault();
    if (formState === 'sending') return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (!serviceId || !templateId || !publicKey) {
      setFormState('error');
      setFormStatus('The contact form is not configured yet. Please email me using the address on this page.');
      return;
    }
    setFormState('sending');
    setFormStatus('Sending your message…');
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            from_name: String(data.get('name') || '').trim(),
            from_email: String(data.get('email') || '').trim(),
            reply_to: String(data.get('email') || '').trim(),
            message: String(data.get('message') || '').trim(),
            to_email: profile.email
          }
        })
      });
      if (!response.ok) throw new Error(`EmailJS returned HTTP ${response.status}`);
      form.reset();
      setFormState('success');
      setFormStatus('Message sent successfully! Thank you for reaching out.');
    } catch (error) {
      console.error('Contact form delivery failed:', error);
      setFormState('error');
      setFormStatus('Your message could not be sent. Please try again or use the email link on this page.');
    }
  };

  return <div className="app-shell">
    <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`} id="site-header" ref={headerRef}>
      <div className="site-header-inner section-wrap">
        <a className="brand" href="#home" onClick={navClick('home')} aria-label="Aditya Kumar, back to top">
          <BrandMark/><span className="brand-name">Aditya Kumar</span>
        </a>
        <nav id="primary-nav" className={`site-nav ${mobileMenu ? 'is-open' : ''}`} aria-label="Primary">
          <ul>
            {NAV.map(({ id, label, Icon }) => <li key={id}>
              <a href={`#${id}`} className={activeSection === id ? 'is-active' : ''} aria-current={activeSection === id ? 'location' : undefined} onClick={navClick(id)}>
                <Icon size={17} aria-hidden="true"/><span>{label}</span>
              </a>
            </li>)}
          </ul>
        </nav>
        <div className="header-actions">
          <button type="button" className="command-hint" onClick={() => setPaletteOpen(true)} aria-label="Open quick navigation" aria-keyshortcuts="Control+K Meta+K" data-tip="Quick navigation">
            <Search size={15} aria-hidden="true"/><kbd>{modifierKey} K</kbd>
          </button>
          <button type="button" className="icon-button" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} data-tip={theme === 'dark' ? 'Light theme' : 'Dark theme'}>
            {theme === 'dark' ? <Sun size={17} aria-hidden="true"/> : <Moon size={17} aria-hidden="true"/>}
          </button>
          <button type="button" ref={menuButtonRef} className="icon-button mobile-menu-button" onClick={() => setMobileMenu(v => !v)} aria-label={mobileMenu ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileMenu} aria-controls="primary-nav">
            {mobileMenu ? <X size={19} aria-hidden="true"/> : <Menu size={19} aria-hidden="true"/>}
          </button>
        </div>
      </div>
    </header>

    <main>
      <section className="hero section-wrap" id="home">
        <div className="hero-grid">
          <motion.div className="hero-copy" initial="hidden" animate="visible" variants={reveal}>
            <div className="availability"><span className="availability-dot" /> OPEN TO {profile.target.toUpperCase()}</div>
            <p className="hero-kicker">HELLO, I'M</p>
            <h1>Aditya<br/><span>Kumar<span className="lime">.</span></span></h1>
            <p className="hero-statement">{profile.positioning}</p>
            <p className="hero-description">{profile.intro}</p>
            <div className="hero-ctas">
              <button className="button button-primary" onClick={() => goTo('projects')}>Explore projects <ArrowDownRight size={17}/></button>
              <a className="button button-secondary" href="/Aditya_Kumar_Resume.pdf" download="Aditya_Kumar_Resume.pdf">Download resume <Download size={16} aria-hidden="true"/></a>
              <button className="button button-primary hero-talk-button" type="button" onClick={() => goTo('contact')}>Let's talk <ArrowUpRight size={16}/></button>
            </div>
            <div className="hero-socials">
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"><FaGithub size={16} aria-hidden="true"/> GitHub <ArrowUpRight size={12} aria-hidden="true"/></a>
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"><FaLinkedin size={16} aria-hidden="true"/> LinkedIn <ArrowUpRight size={12} aria-hidden="true"/></a>
              <a href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`}><Mail size={16} aria-hidden="true"/> Email <ArrowUpRight size={12} aria-hidden="true"/></a>
            </div>
          </motion.div>

          <motion.div className="hero-portrait" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .6, ease: 'easeOut' }}>
            <figure className="avatar">
              <div className="avatar-frame">
                {photoAvailable
                  ? <picture>
                      <source type="image/webp" srcSet="/profile-480.webp 480w, /profile-840.webp 840w" sizes="(max-width: 680px) 78vw, 400px" />
                      <img className="avatar-photo" src="/profile.jpg" alt="Portrait of Aditya Kumar in a black shirt with an orange lanyard, arms crossed, against a yellow wall" width="1365" height="2048" fetchpriority="high" decoding="async" onError={() => setPhotoAvailable(false)} />
                    </picture>
                  : <div className="avatar-fallback" role="img" aria-label="Portrait placeholder"><span>AK</span><small>Add your portrait to public/profile.jpg</small></div>}
              </div>
            </figure>
          </motion.div>
        </div>
        <div className="hero-bottomline"><span>SCROLL TO EXPLORE</span><span className="bottomline-rule"/><span>PORTFOLIO — 2026</span></div>
      </section>

      <section className="about section-wrap section-block" id="about">
        <SectionHeading eyebrow="01 / A LITTLE ABOUT ME" title={<>Curiosity, meet<br/><span className="muted-title">craft.</span></>} note="I like understanding how things work — then making them work better."/>
        <div className="about-layout">
          <div className="about-text"><p className="large-copy">I'm a Computer Science and Engineering student at <strong>Silicon University</strong>, building my way toward becoming a dependable full-stack developer.</p><p>My focus is on the complete product experience: interfaces that feel considered, APIs that are easy to reason about, and systems that connect the two cleanly.</p><p>I'm currently looking for <strong>{profile.target}</strong> where I can contribute, learn from real engineering teams, and keep sharpening my fundamentals.</p><button className="text-link" onClick={() => goTo('contact')}>Have something in mind? <ArrowUpRight size={16}/></button></div>
          <div className="about-stats">
            <div className="stat-card"><span className="stat-label">ACADEMIC SNAPSHOT</span><strong>9.40<span>/10</span></strong><span className="stat-caption">Current CGPA</span><div className="stat-bar"><span/></div></div>
            <div className="stat-card stat-card-alt"><span className="stat-label">MY APPROACH</span><div className="approach-lines"><span>01 <b>Stay curious</b></span><span>02 <b>Build with purpose</b></span><span>03 <b>Improve continuously</b></span></div></div>
          </div>
        </div>
      </section>

      <section className="projects-section section-block" id="projects">
        <div className="section-wrap">
          <SectionHeading eyebrow="02 / SELECTED WORK" title={<>Projects with a<br/><span className="muted-title">point of view.</span></>} note="A closer look at the problems, decisions, and systems behind my work."/>
          <div className="projects-list">
            {projects.map(project => <motion.article key={project.id} className={`project-card project-${project.id}`} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .15 }} variants={reveal}>
              <div className="project-visual">
                <div className="visual-top"><span>CASE / {project.number}</span><span>{project.status}</span></div>
                <div className={`project-screenshot-wrap screenshot-${project.id}`}>
                  <img
                    className="project-screenshot"
                    src={project.id === 'satquery' ? '/projects/satquery-dashboard.png' : '/projects/lifelink-home.png'}
                    alt={`${project.name} interface screenshot from the supplied project capture`}
                    width={project.id === 'satquery' ? 1647 : 1881}
                    height={project.id === 'satquery' ? 901 : 881}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="screenshot-overlay"><span>{project.id === 'satquery' ? 'SATELLITE ANALYSIS WORKSPACE' : 'BLOOD DONOR COORDINATION'}</span><ArrowUpRight size={17}/></div>
                </div>
                <div className="visual-bottom"><span>{project.category.toUpperCase()}</span><span>{project.year}</span></div>
              </div>
              <div className="project-info">
                <div className="project-title-row"><div><span className="project-index">{project.number} / {project.year}</span><h3>{project.name}</h3></div><span className="project-status">{project.status}</span></div>
                <p>{project.summary}</p>
                <div className="chip-row">{project.stack.map(s => <span className="chip" key={s}>{s}</span>)}</div>
                <button className="project-open" onClick={() => setSelectedProject(project)}>Explore case study <span><ArrowUpRight size={18}/></span></button>
              </div>
            </motion.article>)}
          </div>
        </div>
      </section>

      <section className="experience-section section-wrap section-block" id="experience">
        <SectionHeading eyebrow="03 / EXPERIENCE & PROOF" title={<>Learning in the field.<br/><span className="muted-title">Proof of practice.</span></>} note="Each record keeps the certificate preview, context, dates, and original PDF together." />
        <div className="certificate-list">
          <article className="certificate-card certificate-card-wide">
            <a className="certificate-preview certificate-image-link" href="/certificates/codebeat-mern-internship.pdf" target="_blank" rel="noopener noreferrer" aria-label="Open original Codebeat MERN Stack internship certificate PDF">
              <img src="/certificates/codebeat-mern-internship.jpg" alt="Codebeat internship certificate issued to Aditya Kumar for MERN Stack, dated 6 June to 12 July 2025" width="1348" height="953" loading="lazy" decoding="async"/>
              <span className="certificate-open">OPEN ORIGINAL PDF <ExternalLink size={13}/></span>
            </a>
            <div className="certificate-meta">
              <span className="eyebrow">INTERNSHIP CERTIFICATE</span>
              <h3>MERN Stack Internship</h3>
              <p className="certificate-organization">Codebeat</p>
              <p className="certificate-date"><strong>Date range:</strong> 6 June – 12 July 2025</p>
              <p>Certificate records completion of the compulsory internship program in MERN Stack at Codebeat.</p>
              <a className="experience-link" href="/certificates/codebeat-mern-internship.pdf" target="_blank" rel="noopener noreferrer">View original certificate PDF <ArrowUpRight size={14}/></a>
            </div>
          </article>
          <article className="certificate-card certificate-card-wide">
            <a className="certificate-preview certificate-image-link" href="/certificates/aws-data-engineering-devops-training.pdf" target="_blank" rel="noopener noreferrer" aria-label="Open original Ingenious-TechWorld Certificate of Appreciation PDF">
              <img src="/certificates/aws-data-engineering-devops-training.jpg" alt="Ingenious-TechWorld Certificate of Appreciation for AWS Data Engineering and DevOps industrial training, dated 25 May to 30 June 2026" width="1347" height="953" loading="lazy" decoding="async"/>
              <span className="certificate-open">OPEN ORIGINAL PDF <ExternalLink size={13}/></span>
            </a>
            <div className="certificate-meta">
              <span className="eyebrow">CERTIFICATE OF APPRECIATION</span>
              <h3>AWS Data Engineering &amp; DevOps Industrial Training</h3>
              <p className="certificate-organization">Ingenious-TechWorld</p>
              <p className="certificate-date"><strong>Date range:</strong> 25 May – 30 June 2026</p>
              <p>Certificate of Appreciation for participation in industrial training on AWS Data Engineering &amp; DevOps. This is a training appreciation certificate, not an internship certificate.</p>
              <a className="experience-link" href="/certificates/aws-data-engineering-devops-training.pdf" target="_blank" rel="noopener noreferrer">View original certificate PDF <ArrowUpRight size={14}/></a>
            </div>
          </article>
        </div>
      </section>

      <section className="skills-section section-wrap section-block" id="skills">
        <SectionHeading eyebrow="04 / TOOLKIT" title={<>My tech stack.<br/><span className="muted-title">Tools behind the work.</span></>} note="Explore the technologies in my current toolkit, filter by focus area, or search for a specific skill."/>
        <div className="skills-explorer">
          <div className="skills-explorer-top">
            <div className="skills-intro">
              <span className="skills-kicker"><Code2 size={14}/> TECHNOLOGY INDEX</span>
              <p><strong>{totalSkills}</strong> technologies and tools across <strong>{skillGroups.length}</strong> categories</p>
            </div>
            <label className="skill-search">
              <Search size={17} aria-hidden="true"/>
              <span className="sr-only">Search technologies</span>
              <input type="search" value={skillSearch} onChange={e => setSkillSearch(e.target.value)} placeholder="Search technologies…" aria-controls="skill-card-grid"/>
              {skillSearch && <button type="button" className="skill-search-clear" onClick={() => setSkillSearch('')} aria-label="Clear technology search"><X size={15}/></button>}
              <kbd>/</kbd>
            </label>
          </div>

          <div className="skill-category-strip" role="group" aria-label="Filter technologies by category">
            <button type="button" className={`skill-category ${activeSkill === 'all' ? 'active' : ''}`} aria-pressed={activeSkill === 'all'} onClick={() => setActiveSkill('all')}>
              <span>All skills</span><small>{String(totalSkills).padStart(2, '0')}</small>
            </button>
            {skillGroups.map(group => <button type="button" key={group.id} className={`skill-category ${activeSkill === group.id ? 'active' : ''}`} aria-pressed={activeSkill === group.id} onClick={() => setActiveSkill(group.id)}>
              <span>{group.label}</span><small>{String(group.items.length).padStart(2, '0')}</small>
            </button>)}
          </div>

          <div className="skill-results-head">
            <span>{activeSkill === 'all' ? 'ALL TECHNOLOGIES' : skillGroups.find(group => group.id === activeSkill)?.label.toUpperCase()}</span>
            <span>{allSkills.length} {allSkills.length === 1 ? 'RESULT' : 'RESULTS'}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div id="skill-card-grid" key={`${activeSkill}-${skillSearch}`} className="skill-card-grid" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} transition={{duration:reduceMotion ? 0 : .16}} aria-live="polite">
              {allSkills.map(skill => <button type="button" key={skill.name} className={`technology-card ${selectedSkill?.name === skill.name ? 'is-selected' : ''}`} aria-pressed={selectedSkill?.name === skill.name} onClick={() => setSelectedSkill(current => current?.name === skill.name ? null : skill)}>
                <TechMark name={skill.name} fallback={skill.mark}/>
                <span className="technology-card-main">
                  <span className="technology-name">{skill.name}</span>
                  <span className="technology-description">{skill.description}</span>
                </span>
                <span className="technology-card-arrow" aria-hidden="true"><ArrowUpRight size={16}/></span>
                <span className="technology-category">{skill.category}</span>
              </button>)}
              {allSkills.length === 0 && <div className="skill-empty-state">
                <span className="skill-empty-icon"><Search size={20}/></span>
                <strong>No matching technologies</strong>
                <p>Try a different search term or choose another category.</p>
                <button type="button" className="text-link" onClick={() => {setSkillSearch('');setActiveSkill('all');}}>Clear filters <ArrowUpRight size={15}/></button>
              </div>}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {selectedSkill && <motion.aside className="skill-explorer-detail" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:5}} transition={{duration:reduceMotion ? 0 : .18}} aria-labelledby="selected-skill-title">
              <div className="skill-detail-head">
                <div className="skill-detail-identity">
                  <TechMark name={selectedSkill.name} fallback={selectedSkill.mark} detail/>
                  <div><span className="eyebrow">TECHNOLOGY DETAIL</span><h3 id="selected-skill-title">{selectedSkill.name}</h3><span className="skill-detail-category">{selectedSkill.category}</span></div>
                </div>
                <button type="button" className="skill-detail-close" onClick={() => setSelectedSkill(null)} aria-label={`Close ${selectedSkill.name} details`}><X size={17}/></button>
              </div>
              <p className="skill-detail-description">{selectedSkill.description}</p>
              <div className="skill-related-projects">
                <span className="eyebrow">RELATED PROJECTS</span>
                {selectedSkillProjects.length > 0 ? <div className="related-project-list">
                  {selectedSkillProjects.map(project => <button type="button" className="related-project" key={project.id} onClick={() => setSelectedProject(project)}>
                    <span className={`related-project-mark related-${project.id}`}>{project.id === 'satquery' ? 'SQ' : 'LL'}</span>
                    <span><strong>{project.name}</strong><small>{project.category}</small></span>
                    <ArrowUpRight size={15}/>
                  </button>)}
                </div> : <p className="no-related-projects">No specific project link is recorded for this technology in the current portfolio content.</p>}
              </div>
            </motion.aside>}
          </AnimatePresence>

          <div className="skill-explorer-footer"><span><Layers3 size={15}/> Selected technologies link back to documented project work.</span><span>NO RATINGS · NO GUESSED PROFICIENCY</span></div>
        </div>
      </section>

      <section className="education-section section-block" id="education">
        <div className="section-wrap">
          <SectionHeading eyebrow="05 / EDUCATION" title={<>The foundation<br/><span className="muted-title">under the work.</span></>} />
          <div className="education-card">
            <div className="education-icon"><GraduationCap size={24}/></div>
            <div className="education-main"><span className="eyebrow">2024 — 2028</span><h3>B.Tech in Computer Science and Engineering</h3><p>Silicon University</p></div>
            <div className="education-grade"><span>CGPA</span><strong>9.40</strong></div>
            <div className="education-side">UNDERGRADUATE<br/>EDUCATION</div>
          </div>
        </div>
      </section>

      <section className="contact-section section-wrap section-block" id="contact">
        <div className="contact-panel">
          <div className="contact-copy"><span className="eyebrow">06 / YOUR TURN</span><h2>Good work starts<br/>with a <span className="lime">conversation.</span></h2><p>Have an internship opportunity, a project idea, or just want to talk engineering? My inbox is open.</p>
            <button className="button button-primary" onClick={copyEmail}>{copied ? <Check size={17}/> : <Copy size={16}/>} {copied ? 'Email copied' : 'Copy email address'}</button>
            <div className="contact-links"><a href={`mailto:${profile.email}`} aria-label={`Send email to ${profile.email}`}><Mail size={16} aria-hidden="true"/>{profile.email}<ArrowUpRight size={13} aria-hidden="true"/></a><a href={`tel:${profile.phone.replaceAll(' ','')}`}><Phone size={16} aria-hidden="true"/>{profile.phone}<ArrowUpRight size={13} aria-hidden="true"/></a><a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"><FaLinkedin size={16} aria-hidden="true"/>LinkedIn<ArrowUpRight size={13} aria-hidden="true"/></a><a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"><FaGithub size={16} aria-hidden="true"/>GitHub<ArrowUpRight size={13} aria-hidden="true"/></a></div>
          </div>
          <form className="contact-form" onSubmit={submitContact}>
            <label htmlFor="name">YOUR NAME</label><input id="name" name="name" placeholder="How should I call you?" required maxLength={100}/>
            <label htmlFor="email">EMAIL ADDRESS</label><input id="email" name="email" type="email" placeholder="you@example.com" required maxLength={160}/>
            <label htmlFor="message">WHAT'S ON YOUR MIND?</label><textarea id="message" name="message" placeholder="Tell me a little about it..." rows="4" required maxLength={3000}/>
            <button className="button button-primary form-submit" type="submit" disabled={formState === 'sending'}>{formState === 'sending' ? 'Sending…' : 'Send message'} <ArrowUpRight size={17}/></button>
            <p className="form-note" aria-live="polite">{formStatus || 'Send a message directly from this form. Your message is processed by EmailJS.'}</p>
          </form>
        </div>
      </section>
    </main>

    <footer className="site-footer">
      <div className="site-footer-inner section-wrap">
        <div className="footer-top">
          <div className="footer-id">
            <a className="brand" href="#home" onClick={navClick('home')} aria-label="Aditya Kumar, back to top"><BrandMark/><span className="brand-name">Aditya Kumar</span></a>
            <p>Building thoughtful digital experiences, one project at a time.</p>
          </div>
          <ul className="footer-social" aria-label="Social links">
            <li><a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile (opens in a new tab)" data-tip="GitHub"><FaGithub size={19} aria-hidden="true"/></a></li>
            <li><a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile (opens in a new tab)" data-tip="LinkedIn"><FaLinkedin size={19} aria-hidden="true"/></a></li>
            <li><a href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`} data-tip="Email"><Mail size={19} aria-hidden="true"/></a></li>
          </ul>
        </div>
        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} Aditya Kumar</p>
          <nav className="footer-links" aria-label="Footer">
            {['projects', 'skills', 'contact'].map(id => <a key={id} href={`#${id}`} onClick={navClick(id)}>{id[0].toUpperCase() + id.slice(1)}</a>)}
            <button type="button" className="terminal-trigger" onClick={() => setTerminalOpen(v => !v)} aria-expanded={terminalOpen}><TerminalIcon size={15} aria-hidden="true"/> Terminal</button>
            <a className="back-to-top" href="#home" onClick={navClick('home')}><ArrowUp size={15} aria-hidden="true"/> Back to top</a>
          </nav>
        </div>
      </div>
    </footer>

    <AnimatePresence>{paletteOpen && <motion.div className="overlay palette-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={e => {if(e.target===e.currentTarget)setPaletteOpen(false)}}>
      <motion.div className="command-palette" role="dialog" aria-modal="true" aria-label="Command palette" initial={{opacity:0,y:-12,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-8}} transition={{duration:.18}}>
        <div className="palette-head"><Command size={17}/><span>Where do you want to go?</span><button onClick={() => setPaletteOpen(false)} aria-label="Close command palette"><X size={16}/></button></div>
        {NAV_ALL.map(({ id, label, Icon }, i) => <button className="palette-item" key={id} autoFocus={i === 0} onClick={() => goTo(id)}><span className="palette-key"><Icon size={16} aria-hidden="true"/></span><span>{label}</span><ArrowUpRight size={15} aria-hidden="true"/></button>)}
        <div className="palette-foot"><span>ESC TO CLOSE</span><span>ENTER TO GO</span></div>
      </motion.div>
    </motion.div>}</AnimatePresence>

    <AnimatePresence>{selectedProject && <motion.div className="overlay case-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={e => {if(e.target===e.currentTarget)setSelectedProject(null)}}>
      <motion.article className="case-modal" role="dialog" aria-modal="true" aria-labelledby="case-title" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:12}} transition={{duration:.22}}>
        <div className="case-modal-top"><span className="eyebrow">CASE STUDY / {selectedProject.number}</span><button className="icon-button" autoFocus onClick={() => setSelectedProject(null)} aria-label="Close case study"><X size={18}/></button></div>
        <div className="case-modal-title"><div><span className="project-status">{selectedProject.status} · {selectedProject.year}</span><h2 id="case-title">{selectedProject.name}</h2><p>{selectedProject.summary}</p></div><span className="case-big-number">{selectedProject.number}</span></div>
        <div className="case-content-grid">
          <div><span className="eyebrow">THE PROBLEM</span><p>{selectedProject.problem}</p></div>
          <div><span className="eyebrow">MY ROLE</span><p>{selectedProject.role}</p></div>
        </div>
        <div className="case-section"><span className="eyebrow">CONTRIBUTIONS</span><ul>{selectedProject.contribution.map(item => <li key={item}>{item}</li>)}</ul></div>
        <div className="case-section"><span className="eyebrow">ARCHITECTURE OVERVIEW</span><div className="architecture-flow">{selectedProject.architecture.map((step,i) => <React.Fragment key={step}><div className="architecture-node"><span>{String(i+1).padStart(2,'0')}</span>{step}</div>{i < selectedProject.architecture.length-1 && <ArrowRight className="architecture-arrow" size={16}/>}</React.Fragment>)}</div><p className="architecture-note"><Workflow size={15}/> High-level flow based on the described project architecture.</p></div>
        <div className="case-section"><span className="eyebrow">KEY FEATURES</span><div className="case-features">{selectedProject.features.map(f => <span key={f}><Check size={14}/>{f}</span>)}</div></div>
        <div className="case-section"><span className="eyebrow">TECH STACK</span><div className="chip-row">{selectedProject.stack.map(s => <span className="chip" key={s}>{s}</span>)}</div></div>
        <div className="case-links"><div><span className="eyebrow">LIVE DEMO</span><code>{selectedProject.liveUrl.startsWith("[") ? "Not supplied / unverified" : selectedProject.liveUrl}</code></div><div><span className="eyebrow">SOURCE CODE</span><code>{selectedProject.githubUrl.startsWith("[") ? "Repository URL not verified" : selectedProject.githubUrl}</code></div><div><span className="eyebrow">SCREENSHOTS</span><code>{selectedProject.screenshots.startsWith("[") ? "Screenshots shown above" : selectedProject.screenshots}</code></div></div>
        <button className="text-link" onClick={() => setSelectedProject(null)}><ArrowLeft size={16}/> Back to all projects</button>
      </motion.article>
    </motion.div>}</AnimatePresence>

    <AnimatePresence>{terminalOpen && <motion.div className="terminal-window" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:12}} role="dialog" aria-modal="false" aria-label="Mini terminal">
      <div className="terminal-bar"><span className="terminal-dots"><i/><i/><i/></span><span>ak@portfolio:~</span><button onClick={() => setTerminalOpen(false)} aria-label="Close terminal"><X size={15}/></button></div>
      <div className="terminal-body"><p>Aditya's tiny corner of the internet.</p><p className="terminal-output">{terminalOutput}</p><form onSubmit={runTerminal}><span>›</span><input autoFocus value={terminalInput} onChange={e => setTerminalInput(e.target.value)} aria-label="Terminal command" placeholder="type a command..." /></form></div>
    </motion.div>}</AnimatePresence>
  </div>;
}

export default App;