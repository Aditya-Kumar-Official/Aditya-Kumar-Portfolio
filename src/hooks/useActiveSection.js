import { useEffect, useState } from 'react';

/* Highlights the section crossing a band around 40% down the viewport. An IntersectionObserver
   replaces the old scroll listener (no per-frame layout reads, no per-frame React renders). */
export function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const seen = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
      const current = ids.find((id) => seen.get(id));
      if (current) setActive(current);
      else if (window.scrollY < 200) setActive(null);
    }, { rootMargin: '-40% 0px -55% 0px' });
    // Sections are lazy-loaded, so keep looking until each one exists in the DOM.
    let attached = 0;
    const attach = () => {
      ids.forEach((id) => { const el = document.getElementById(id); if (el && !el.dataset.observed) { el.dataset.observed = '1'; io.observe(el); attached++; } });
      if (attached === ids.length) mo.disconnect(); // everything found: stop watching the DOM
    };
    const mo = new MutationObserver(attach);
    attach();
    mo.observe(document.getElementById('root'), { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [ids]);
  return active;
}
