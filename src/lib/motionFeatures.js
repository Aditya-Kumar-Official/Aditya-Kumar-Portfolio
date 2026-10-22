/* Framer Motion's animation engine (incl. layout animations), loaded on demand by <LazyMotion>
   in App.jsx so it stays off the critical path. Components use the tiny `m` factory instead of `motion`. */
import { domMax } from 'framer-motion';
export default domMax;
