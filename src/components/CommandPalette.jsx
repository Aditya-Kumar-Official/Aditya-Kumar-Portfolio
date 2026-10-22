import { useEffect, useMemo, useRef, useState } from 'react';
import { m } from 'framer-motion';
import { ArrowUpRight, Briefcase, Copy, Download, FolderGit2, Home, Mail, Moon, Search, Sun, User, Wrench } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { profile } from '../data/site.js';
import { lockScroll, scrollToId, unlockScroll } from '../lib/scroll.js';

/* Ctrl/Cmd+K palette using the ARIA combobox + listbox pattern: focus stays in the input,
   arrow keys move aria-activedescendant, Enter runs the highlighted command. */
export default function CommandPalette({ onClose, theme, onToggleTheme }) {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const input = useRef(null);
  const opener = useRef(document.activeElement);

  const commands = useMemo(() => [
    { id: 'home', label: 'Go to top', group: 'Navigate', Icon: Home, run: () => scrollToId('home') },
    { id: 'about', label: 'About', group: 'Navigate', Icon: User, run: () => scrollToId('about') },
    { id: 'skills', label: 'Skills', group: 'Navigate', Icon: Wrench, run: () => scrollToId('skills') },
    { id: 'projects', label: 'Projects', group: 'Navigate', Icon: FolderGit2, run: () => scrollToId('projects') },
    { id: 'experience', label: 'Experience', group: 'Navigate', Icon: Briefcase, run: () => scrollToId('experience') },
    { id: 'contact', label: 'Contact', group: 'Navigate', Icon: Mail, run: () => scrollToId('contact') },
    { id: 'theme', label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme', group: 'Actions', Icon: theme === 'dark' ? Sun : Moon, run: onToggleTheme },
    { id: 'resume', label: 'Download resume', group: 'Actions', Icon: Download, run: () => { const a = document.createElement('a'); a.href = profile.resumeUrl; a.download = 'Aditya_Kumar_Resume.pdf'; a.click(); } },
    { id: 'copy', label: 'Copy email address', group: 'Actions', Icon: Copy, run: () => navigator.clipboard?.writeText(profile.email) },
    { id: 'github', label: 'Open GitHub', group: 'Links', Icon: FaGithub, run: () => window.open(profile.githubUrl, '_blank', 'noopener') },
    { id: 'linkedin', label: 'Open LinkedIn', group: 'Links', Icon: FaLinkedin, run: () => window.open(profile.linkedinUrl, '_blank', 'noopener') }
  ], [theme, onToggleTheme]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)) : commands;
  }, [commands, query]);

  useEffect(() => { input.current?.focus(); lockScroll('palette'); return () => { unlockScroll('palette'); opener.current?.focus?.(); }; }, []);
  useEffect(() => setIndex(0), [query]);

  const run = (cmd) => { unlockScroll('palette'); onClose(); // release the lock first, or Lenis ignores the scroll
    setTimeout(() => cmd.run(), 60); };
  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => (i + 1) % Math.max(results.length, 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => (i - 1 + results.length) % Math.max(results.length, 1)); }
    else if (e.key === 'Enter' && results[index]) { e.preventDefault(); run(results[index]); }
    else if (e.key === 'Tab') e.preventDefault(); // single focus target: keep focus inside the dialog
  };

  return (
    <m.div className="fixed inset-0 z-[120] flex items-start justify-center bg-black/60 px-4 pt-[14vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <m.div role="dialog" aria-modal="true" aria-label="Command palette" onKeyDown={onKey}
        className="glass w-full max-w-xl overflow-hidden !bg-surface/90" initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
        <div className="flex items-center gap-3 border-b hairline px-4">
          <Search size={17} className="text-muted" aria-hidden="true" />
          <input ref={input} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type a command or section…"
            role="combobox" aria-expanded="true" aria-controls="palette-list" aria-activedescendant={results[index] ? `cmd-${results[index].id}` : undefined} aria-label="Search commands"
            className="h-14 w-full bg-transparent text-base text-ink outline-none placeholder:text-muted" />
          <kbd className="rounded border hairline px-1.5 py-0.5 text-xs text-muted">Esc</kbd>
        </div>
        <ul id="palette-list" role="listbox" aria-label="Commands" className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-4 py-8 text-center text-sm text-muted">No command matches &ldquo;{query}&rdquo;. Try &ldquo;projects&rdquo; or &ldquo;theme&rdquo;.</li>}
          {results.map((c, i) => (
            <li key={c.id} id={`cmd-${c.id}`} role="option" aria-selected={i === index} onMouseMove={() => setIndex(i)} onClick={() => run(c)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm ${i === index ? 'bg-accent-from/20 text-ink' : 'text-muted'}`}>
              <c.Icon size={17} aria-hidden="true" />
              <span className="flex-1">{c.label}</span>
              <span className="text-xs opacity-70">{c.group}</span>
              {i === index && <ArrowUpRight size={14} aria-hidden="true" />}
            </li>
          ))}
        </ul>
      </m.div>
    </m.div>
  );
}
