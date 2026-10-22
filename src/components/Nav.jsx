import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m, useScroll, useSpring } from 'framer-motion';
import { Menu, Moon, Search, Sun, X } from 'lucide-react';
import { nav, profile } from '../data/site.js';
import { useActiveSection } from '../hooks/useActiveSection.js';
import { lockScroll, scrollToId, unlockScroll } from '../lib/scroll.js';
import Magnetic from './Magnetic.jsx';

const IDS = nav.map((n) => n.id);
const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');

export function Logo({ className = '' }) {
  return (
    <span className={`grid h-9 w-9 place-items-center rounded-xl font-display text-sm font-bold text-white ${className}`} style={{ background: 'linear-gradient(135deg, rgb(var(--accent-from)), rgb(var(--accent-to)))' }} aria-hidden="true">AK</span>
  );
}

export default function Nav({ theme, onToggleTheme, onOpenPalette }) {
  const active = useActiveSection(IDS);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef(null);
  const headerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile menu: lock scroll, close on Escape / outside press / growing to desktop, return focus to the button.
  useEffect(() => {
    if (!open) return undefined;
    lockScroll('menu');
    const close = () => { setOpen(false); menuBtn.current?.focus(); };
    const onKey = (e) => e.key === 'Escape' && close();
    const onDown = (e) => { if (headerRef.current && !headerRef.current.contains(e.target)) setOpen(false); };
    const mq = window.matchMedia('(min-width: 768px)');
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener('keydown', onKey); document.addEventListener('pointerdown', onDown); mq.addEventListener('change', onMq);
    return () => { unlockScroll('menu'); document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); mq.removeEventListener('change', onMq); };
  }, [open]);

  const go = (id) => (e) => { e.preventDefault(); unlockScroll('menu'); setOpen(false); scrollToId(id); };

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-40" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className={`transition-[background-color,border-color,backdrop-filter] duration-300 ${scrolled || open ? 'glass !rounded-none !border-x-0 !border-t-0 !shadow-none' : 'border-b border-transparent'}`}>
        <div className="wrap flex h-16 items-center justify-between gap-4">
          <a href="#home" onClick={go('home')} className="flex items-center gap-3" aria-label={`${profile.name}, back to top`}>
            <Logo /><span className="hidden font-display text-base font-semibold tracking-tight sm:inline">{profile.name}</span>
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {nav.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`} onClick={go(id)} aria-current={active === id ? 'location' : undefined}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${active === id ? 'text-ink' : 'text-muted hover:text-ink'}`}>
                    {active === id && <m.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full" style={{ background: 'rgb(var(--line) / .09)' }} transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" onClick={onOpenPalette} aria-label="Open command palette" aria-keyshortcuts="Control+K Meta+K"
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-ink sm:flex hairline border">
              <Search size={15} aria-hidden="true" /><kbd className="font-sans text-xs">{isMac ? '\u2318' : 'Ctrl'} K</kbd>
            </button>
            <Magnetic strength={0.2}>
              <button type="button" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                className="grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:text-ink hairline border">
                {theme === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
              </button>
            </Magnetic>
            <button ref={menuBtn} type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid h-10 w-10 place-items-center rounded-full hairline border md:hidden">
              {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <m.nav id="mobile-nav" aria-label="Mobile" className="md:hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
              <ul className="wrap flex flex-col pb-4">
                {nav.map(({ id, label }) => (
                  <li key={id}><a href={`#${id}`} onClick={go(id)} aria-current={active === id ? 'location' : undefined}
                    className={`block border-t hairline py-4 font-display text-2xl ${active === id ? 'text-accent' : 'text-ink'}`}>{label}</a></li>
                ))}
                <li><button type="button" onClick={() => { setOpen(false); onOpenPalette(); }} className="flex w-full items-center gap-2 border-t hairline py-4 text-left text-muted"><Search size={16} aria-hidden="true" /> Quick navigation</button></li>
              </ul>
            </m.nav>
          )}
        </AnimatePresence>
      </div>
      {/* scroll progress: transform-only, so it never causes layout */}
      <m.div aria-hidden="true" className="h-0.5 origin-left" style={{ scaleX: progress, background: 'linear-gradient(90deg, rgb(var(--accent-from)), rgb(var(--accent-to)))' }} />
    </header>
  );
}
