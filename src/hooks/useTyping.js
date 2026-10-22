import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../lib/scroll.js';

/* Types and deletes each word in turn. Reduced motion shows the first word, static. */
export function useTyping(words, { active = true, type = 70, erase = 36, hold = 1700 } = {}) {
  const [text, setText] = useState(prefersReducedMotion() ? words[0] : '');
  useEffect(() => {
    if (!active || prefersReducedMotion()) return undefined;
    let i = 0, n = 0, deleting = false, timer;
    const step = () => {
      const word = words[i];
      n += deleting ? -1 : 1;
      setText(word.slice(0, n));
      let delay = deleting ? erase : type;
      if (!deleting && n === word.length) { deleting = true; delay = hold; }
      else if (deleting && n === 0) { deleting = false; i = (i + 1) % words.length; delay = 350; }
      timer = setTimeout(step, delay);
    };
    timer = setTimeout(step, 400);
    return () => clearTimeout(timer);
  }, [active, words, type, erase, hold]);
  return text;
}
