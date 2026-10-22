import { ArrowUp } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { Mail } from 'lucide-react';
import { profile } from '../data/site.js';
import { scrollToId } from '../lib/scroll.js';

export default function Footer() {
  return (
    <footer className="border-t hairline py-10">
      <div className="wrap flex flex-col items-center justify-between gap-6 sm:flex-row">
        <p className="text-sm text-muted">&copy; {new Date().getFullYear()} {profile.name}. Built with React, Vite and Tailwind CSS.</p>
        <ul className="flex items-center gap-2" aria-label="Social links">
          {[
            { href: profile.githubUrl, label: 'GitHub (opens in a new tab)', Icon: FaGithub, ext: true },
            { href: profile.linkedinUrl, label: 'LinkedIn (opens in a new tab)', Icon: FaLinkedin, ext: true },
            { href: `mailto:${profile.email}`, label: `Email ${profile.email}`, Icon: Mail }
          ].map(({ href, label, Icon, ext }) => (
            <li key={label}><a href={href} aria-label={label} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:text-ink hairline border"><Icon size={17} aria-hidden="true" /></a></li>
          ))}
        </ul>
        <button type="button" onClick={() => scrollToId('home')} className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink">
          Back to top <ArrowUp size={15} aria-hidden="true" />
        </button>
      </div>
    </footer>
  );
}
