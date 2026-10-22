import { useCallback, useEffect, useState } from 'react';

/* The inline script in index.html already set data-theme before paint; this hook just reads it,
   flips it, and persists the choice. localStorage can throw (private mode), hence the try/catch. */
export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', theme === 'light' ? '#f6f7fd' : '#07080f');
    try { localStorage.setItem('ak-theme', theme); } catch { /* storage blocked: theme still works for this visit */ }
  }, [theme]);
  return [theme, toggle];
}
