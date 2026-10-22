import { m } from 'framer-motion';

/* Used sparingly, and only on groups of items (cards, list rows) so they arrive staggered
   rather than every heading and paragraph sliding in. `once` keeps it from replaying on scroll-back. */
const container = (stagger) => ({ hidden: {}, show: { transition: { staggerChildren: stagger } } });
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };

export function RevealGroup({ children, stagger = 0.08, className = '', as: Tag = 'div', ...rest }) {
  const M = m[Tag];
  return <M className={className} variants={container(stagger)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} {...rest}>{children}</M>;
}
export function RevealItem({ children, className = '', as: Tag = 'div', ...rest }) {
  const M = m[Tag];
  return <M className={className} variants={item} {...rest}>{children}</M>;
}
