import React from 'react';
import { Cloud, Database, Infinity as InfinityIcon, KeyRound, ShieldCheck, Webhook } from 'lucide-react';
import {
  SiAppwrite, SiC, SiCss, SiExpress, SiFastapi, SiGit, SiGithub, SiHtml5, SiJavascript,
  SiJsonwebtokens, SiMongodb, SiNodedotjs, SiPostgresql, SiPostman, SiPython, SiReact,
  SiRedux, SiSocketdotio, SiTailwindcss
} from 'react-icons/si';
import { FaAws, FaJava } from 'react-icons/fa6';
import { VscVscode } from 'react-icons/vsc';

/* Brand logos use the official mark; the colour is the brand colour, softened toward the
   page ink in CSS (.tech-mark) so every logo keeps enough contrast in dark and light
   themes. Brands whose logo is black use 'ink' so they follow the theme instead.
   Skills with no brand mark (SQL, REST, auth, cloud/DevOps concepts) use Lucide glyphs. */
const TECH = {
  C: { Icon: SiC, color: '#A8B9CC' },
  Python: { Icon: SiPython, color: '#3776AB' },
  Java: { Icon: FaJava, color: '#ED8B00' },
  JavaScript: { Icon: SiJavascript, color: '#F7DF1E' },
  SQL: { Icon: Database, color: '#8EA3B8', line: true },
  React: { Icon: SiReact, color: '#61DAFB' },
  HTML: { Icon: SiHtml5, color: '#E34F26' },
  CSS: { Icon: SiCss, color: '#663399' },
  'Tailwind CSS': { Icon: SiTailwindcss, color: '#06B6D4' },
  'Redux Toolkit': { Icon: SiRedux, color: '#764ABC' },
  'Node.js': { Icon: SiNodedotjs, color: '#5FA04E' },
  'Express.js': { Icon: SiExpress, color: 'ink' },
  'Socket.io': { Icon: SiSocketdotio, color: 'ink' },
  FastAPI: { Icon: SiFastapi, color: '#009688' },
  'REST APIs': { Icon: Webhook, color: '#8EA3B8', line: true },
  JWT: { Icon: SiJsonwebtokens, color: 'ink' },
  'Authentication & Authorization': { Icon: ShieldCheck, color: '#8EA3B8', line: true },
  MongoDB: { Icon: SiMongodb, color: '#47A248' },
  PostgreSQL: { Icon: SiPostgresql, color: '#4169E1' },
  Git: { Icon: SiGit, color: '#F05032' },
  GitHub: { Icon: SiGithub, color: 'ink' },
  'VS Code': { Icon: VscVscode, color: '#007ACC' },
  Postman: { Icon: SiPostman, color: '#FF6C37' },
  Appwrite: { Icon: SiAppwrite, color: '#FD366E' },
  AWS: { Icon: FaAws, color: '#FF9900' },
  'Cloud fundamentals': { Icon: Cloud, color: '#8EA3B8', line: true },
  'DevOps fundamentals': { Icon: InfinityIcon, color: '#8EA3B8', line: true }
};

export function TechIcon({ name, size = 22 }) {
  const entry = TECH[name];
  if (!entry) return <KeyRound size={size} aria-hidden="true" />;
  const { Icon, line } = entry;
  return line
    ? <Icon size={size} strokeWidth={1.75} aria-hidden="true" focusable="false" />
    : <Icon size={size} aria-hidden="true" focusable="false" />;
}

/* Technology logo, tinted via the .tech-mark class. Falls back to the text mark from the data file. */
export function TechMark({ name, fallback, size = 22, className = '' }) {
  const entry = TECH[name];
  const color = entry ? (entry.color === 'ink' ? 'var(--ink)' : entry.color) : 'var(--muted)';
  return (
    <span
      className={`tech-mark inline-grid place-items-center ${className}`.trim()}
      style={{ '--brand': color }}
      aria-hidden="true"
    >
      {entry ? <TechIcon name={name} size={size} /> : fallback}
    </span>
  );
}
