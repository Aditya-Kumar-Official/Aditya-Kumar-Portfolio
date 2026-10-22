/* Data for the hero "project map". Presentation lives in components/HeroVisual.jsx.

   SOURCE OF TRUTH RULES
   - SatQuery AI and LifeLink: name, status, summary, stack, links and the component LABELS are read
     from `projects` in site.js (architecture[i] -> components[i]). Edit those there, not here.
   - Each component's `detail` sentence only restates what site.js already says in `approach` / `delivers`.
   - Edges mirror the flow described in `architecture` (and the old stack map's LifeLink links).
     They are a high-level description, not a trace of the source code, which is not in this repo.
   - Nothing here is live data: no uptime, metrics, or deployment claims. */
import { projects } from './site.js';

const fromSite = (id) => projects.find((p) => p.id === id);

const build = (id, layout) => {
  const p = fromSite(id);
  return {
    id, name: p.name, status: p.status, summary: p.summary, stack: p.stack,
    caseStudyId: p.id, liveUrl: p.liveUrl, repos: p.repos ?? [],
    components: layout.components.map((c, i) => ({ ...c, label: p.architecture[i] ?? c.fallback })),
    edges: layout.edges
  };
};

export const mapProjects = [
  build('satquery', {
    // request flows out through the API and router; results come back through the results endpoint
    components: [
      { id: 'ui', fallback: 'React + Vite', role: 'Frontend', detail: 'Where imagery is uploaded and questions are asked in plain English.', x: 17, y: 22 },
      { id: 'api', fallback: 'FastAPI REST API', role: 'Backend (my work)', detail: 'Endpoints for satellite-image uploads, natural-language queries and result retrieval.', x: 50, y: 22 },
      { id: 'router', fallback: 'Agent routing', role: 'Routing layer', detail: 'Directs each query to the matching satellite-image analysis module; the backend integrates with it.', x: 83, y: 22 },
      { id: 'modules', fallback: 'Analysis modules', role: 'AI analysis pipeline', detail: 'The analysis modules that queries are routed to. My part was the backend interfaces to them.', x: 66, y: 66 },
      { id: 'results', fallback: 'Results API', role: 'Result retrieval', detail: 'Endpoint the frontend uses to retrieve analysis results.', x: 28, y: 66 }
    ],
    edges: [['ui', 'api'], ['api', 'router'], ['router', 'modules'], ['modules', 'results'], ['results', 'ui']]
  }),
  build('lifelink', {
    components: [
      { id: 'ui', fallback: 'React UI', role: 'Frontend', detail: 'Donor registration, blood requests, hospital management and admin interfaces.', x: 16, y: 42 },
      { id: 'api', fallback: 'Express REST API', role: 'Backend', detail: 'REST API functionality for the platform.', x: 50, y: 42 },
      { id: 'auth', fallback: 'JWT + role checks', role: 'Authentication', detail: 'JWT-based authentication with role-based features.', x: 50, y: 78 },
      { id: 'live', fallback: 'Socket.io live updates', role: 'Live updates', detail: 'Pushes request and donor updates to people live.', x: 82, y: 16 },
      { id: 'db', fallback: 'MongoDB models', role: 'Database', detail: 'MongoDB data models behind the API.', x: 84, y: 66 }
    ],
    edges: [['ui', 'api'], ['api', 'auth'], ['api', 'live'], ['api', 'db']]
  })
];
