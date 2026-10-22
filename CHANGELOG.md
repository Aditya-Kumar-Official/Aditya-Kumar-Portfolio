# Changelog (WiFi Transparency Analyzer removal + repository buttons)

- **Removed:** WiFi Transparency Analyzer is gone from the hero project map (its entry in `src/data/systemMap.js`). It was never in the Projects section or `site.js`, so no case study, image or skill mapping needed removing.
- **Repository buttons:** `projects[].githubUrl` is replaced by `projects[].repos`, a list of `{ label, url }`. SatQuery AI has one "GitHub Repository" button; LifeLink has separate "Frontend Repository" and "Backend Repository" buttons. They render on the project card, in the case-study modal and in the hero project map (`Projects.jsx`, `CaseStudyModal.jsx`, `HeroVisual.jsx`; `systemMap.js` passes `repos` through).
- **Note:** `public/Aditya_Kumar_Resume.pdf` still lists WiFi Transparency Analyzer. It is a separate document and was not edited.

# Changelog (project map + contact hardening)

- **Hero:** `HeroVisual.jsx` is now a project map (SatQuery AI, LifeLink) instead of a stack-label network. Data: `src/data/systemMap.js`, which reads names, status, stack, links and component labels from `site.js`. Hover/focus lights up real connections; click/Enter pins; Esc/Reset releases; "Case study" opens the existing modal (`open-case-study` event handled in `Projects.jsx`). Below `lg` it renders as an ordered list instead of being hidden. No live/online indicator anywhere.
- **Contact:** double-submit guard, 15 s timeout, 30 s cooldown, separate messages for missing config / cooldown / failed send; the message stays in the form on failure; success only after EmailJS returns 2xx.
- **.gitignore:** now ignores `.env.*` and `*.local` (keeps `.env.example`).

# Changelog (this round)

## Applied (all from your approved list)
- **Projects:** removed the technology tag-filter chips (and the filter state / layout animation that only existed for them). Both project cards now always show.
- **About:** replaced the Featured projects / Certificates / Technologies counters. CGPA (9.40/10) still counts up; the new cards are plain text taken from your data: "Class of 2028" (end of the 2024–2028 B.Tech range) and "MERN internships" (your stated target). Edit in `statsConfig` in `src/data/site.js`.
- **Hero:** deleted the particle canvas (`ParticleField.jsx`). The first replacement (rings) was redesigned into an interactive stack map (`HeroVisual.jsx`): React, FastAPI, Express.js, Socket.io, MongoDB and JWT as nodes, joined by lines that mirror the architecture lists in `site.js`. Hover/focus a node to light up its links and see which project uses it; click (or Enter/Space) to pin. The card tilts and a glow follows the mouse (mouse/trackpad only). Desktop only (not mounted below `lg`); no tilt/float under `prefers-reduced-motion`.
- **Loader:** status text is now "Loading fonts…", "Loading images…", "Ready" (the old lines were placeholders).
- **Skills:** reworded every placeholder description ("listed in the portfolio toolkit") into a plain definition of the tool. They describe what the tool is, not how you used it, so no new claims. Descriptions that already referenced SatQuery AI / LifeLink were kept.

## Added in this update
- **Scroll fix:** wheel/trackpad scrolling froze in dev because React StrictMode ran the smooth-scroll setup twice and left an orphaned Lenis instance that blocked wheel events without ever scrolling. `initSmoothScroll` (`src/lib/scroll.js`) is now cancel-safe and creates at most one instance. Verified with real wheel input in the dev server (0 → 900 → 400).
- **Hero map clickability:** the hero text column was overlapping the map and swallowing hovers; the map now sits above it (its container ignores pointer events except on nodes).
- **Certificates:** added Deloitte "Data Analytics Job Simulation" (via Forage, 9 July 2025; labelled a job simulation, not an internship) and IBM SkillsBuild "Getting Started with Artificial Intelligence" (15 November 2025, with a "Verify credential on Credly" link taken from the certificate). Originals are in `public/certificates/`, previews are 480/960 webp. The Experience intro line was reworded to cover them.

## Performance
- The hero headline now starts revealing as the loader panels begin to open instead of after they finish.
- Lazy-section prefetch now runs one chunk per idle slot instead of all at once (removes a long main-thread task).
- Nothing removed from the loader: the 2 s minimum is unchanged.

## Not changed
- Contact form code (EmailJS) is untouched; it needs your keys to send real mail (see TODO).
- No hackathon content anywhere (checked).
- No invented facts, metrics, links or dates.

## TODO (yours)
1. Add `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` in `.env.local` and in Vercel; send a test message.
2. `liveUrl` / `githubUrl` are `null` for SatQuery AI and LifeLink; add verified URLs and the buttons appear.
3. Confirm the LifeLink wording "real-time" and "Socket.io" is accurate (flagged `NEW` in `site.js`).
4. Confirm "Class of 2028" is the graduation year you want shown.
5. Set `VITE_SITE_URL` if you use a custom domain (otherwise Vercel's URL is used).
6. Re-run Lighthouse on the deployed Vercel URL; sandbox numbers below are lab estimates.
