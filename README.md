# Aditya Kumar — Developer Portfolio

A responsive React + Vite portfolio using Framer Motion and Lucide icons.

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite. Verify a production build with:
```bash
npm run build
npm run preview
```

## Edit content
- `src/data/portfolio.js`: profile, projects, skills, and project placeholders.
- `src/styles.css`: design tokens are at the top (`:root` and `:root[data-theme="light"]`).
- `src/App.jsx`: layout, interactions, case-study modal, command palette, terminal, and contact form behavior.
- `index.html`: SEO metadata, social card basics, and Person JSON-LD.

## Fill these placeholders before launch
- `[LIVE_URL]` for each project, if a verified live deployment exists.
- `[GITHUB_URL]` for each project repository.
- `[SCREENSHOTS]` with actual project screenshots (the case study currently displays this placeholder as text).
- `public/resume.pdf`: add your actual resume PDF; this starter intentionally does not invent one.
- `[YOUR_DOMAIN]` in `public/robots.txt` and `public/sitemap.xml`.
- Verify that the GitHub profile URL in `src/data/portfolio.js` opens your account before publishing.

## Contact form
The contact form uses EmailJS REST API. Configure the environment variables below before deploying. Without credentials, the form shows an honest setup error and the visible email link remains available.

## Deploy to Vercel
1. Push this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
4. Add your custom domain in Vercel settings if you have one.
5. Update the sitemap and social metadata with your real domain, then redeploy.

## Deploy to Netlify
1. Import the Git repository into Netlify.
2. Build command: `npm run build`; publish directory: `dist`.
3. For client-side routing, add a `public/_redirects` file with `/* /index.html 200` if routes are added later.

## Accessibility/performance notes
- Semantic sections and labelled form controls are included.
- Focus states and reduced-motion preferences are supported.
- No heavy 3D runtime is used; the hero artwork is CSS-based.
- Verify contrast, keyboard flow, production bundle, mobile layout, and Lighthouse scores on the final deployed site. Lighthouse targets are goals, not guaranteed results before testing.

## Photo, internships, and certificates
- Your supplied portrait is included at `public/profile.jpg`. Replace it if you want to use a different photo.
- The Experience & Proof section presents each supplied certificate as one responsive card, with its preview, organization, category, date range, concise context, and original PDF link together.
- `public/certificates/codebeat-mern-internship.pdf` is the Codebeat MERN Stack internship certificate (6 June–12 July 2025); a JPG preview is provided for the certificate wall.
- `public/certificates/aws-data-engineering-devops-training.pdf` is the Ingenious-TechWorld Certificate of Appreciation for AWS Data Engineering & DevOps industrial training (25 May–30 June 2026); a JPG preview is provided for the certificate wall.
- Clicking a certificate preview or its link opens the original PDF in a new tab. Keep the preview and PDF filenames aligned if you replace either file.

## Contact form behavior
The contact form uses EmailJS to submit messages without opening the visitor's email app. Delivery requires valid EmailJS credentials, a correctly configured template, and the EmailJS service being available. The visitor receives a success message only after the EmailJS API returns success.


## Header, portrait, footer and icons
- **Icons:** UI glyphs come from `lucide-react` (one 1.75 stroke weight, set in `styles.css`). Technology and social brand logos come from `react-icons` (`src/components/icons.jsx` maps each skill name to its logo; skills without an official mark use a Lucide glyph).
- **Header:** sticky, gains a blurred surface and border once scrolled. The active section is tracked on scroll (`aria-current="location"`). Navigation links, the mobile menu and the command palette share one `NAV` list in `App.jsx`. Mobile menu: Escape or an outside tap closes it and returns focus to the button.
- **Portrait:** the unmodified `public/profile.jpg` in a circular frame. `profile-480.webp` and `profile-840.webp` are smaller copies of the same photo served through `<picture>`; `profile.jpg` remains the original and the fallback. It is cropped to a circle with a hairline ring and a short accent arc that turns slightly on hover.
- **Removed:** the "Background" control (Soft light / Plain) below the portrait, the pointer-following glow, and the orbit/ambient decorations behind the photo. The header Sun/Moon toggle is the site-wide light/dark theme and was kept.
- **Footer:** brand, short tagline, GitHub / LinkedIn / email icons (URLs come from `src/data/portfolio.js`), Projects / Skills / Contact links, mini terminal, back to top.
- Project screenshots in `public/projects/` are the supplied SatQuery AI and LifeLink captures.

## Recent maintenance
- Grouped each certificate image and its full context into a single card; cards sit side-by-side on desktop and stack on narrow screens.
- Preserved the distinction between the Codebeat MERN Stack internship certificate and the Ingenious-TechWorld Certificate of Appreciation for industrial training.
- Added intrinsic dimensions and async decoding to the supplied images; the hero portrait is eager-loaded with high fetch priority.
- Improved visible keyboard focus, mobile navigation state announcements, and dialog focus handling.
- The hero's Download resume button serves `public/Aditya_Kumar_Resume.pdf`.
- Project live/repository destinations remain placeholders until verified.


### Interactive Tech Stack / Skills Explorer
- The Skills section is a searchable, filterable technology-card explorer built with the existing React state and Framer Motion setup.
- Categories: Programming Languages, Frontend Development, Backend Development, Databases, Tools & Development, and Cloud & DevOps.
- Selecting a technology reveals a compact detail panel and only the projects explicitly associated with that technology in `src/data/portfolio.js`.
- Search shortcut: press `/` when focus is not inside a form field to focus the technology search.
- Technology descriptions and project associations are based on the existing portfolio content; no proficiency scores or years of experience are displayed.
- Existing toolkit entries (including SQL, Tailwind CSS, Redux Toolkit, REST APIs, JWT, PostgreSQL, and Appwrite) are retained in the category data.


## Configure EmailJS contact form

1. Create a free account at https://www.emailjs.com/ and connect your email account in **Email Services**.
2. Create an email template in **Email Templates**. Use these variables in your template: `{{from_name}}`, `{{from_email}}`, `{{message}}`. Set **Reply To** to `{{reply_to}}`. Set recipient to your own verified mailbox (or use `{{to_email}}` if your EmailJS template supports it).
3. Copy `.env.example` to `.env.local` and fill `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` from your EmailJS dashboard. **These are public browser credentials, not private API keys.**
4. Run `npm install` then `npm run dev`; submit a real test message and confirm it arrives in your inbox (check spam too).
5. For Vercel/Netlify, set the same three `VITE_` variables in your project environment settings, then **redeploy**. Add your production domain to EmailJS allowed origins if required.

**Security:** Never place EmailJS private keys or email account passwords in frontend code. Consider enabling EmailJS domain restrictions and anti-spam protections. A successful API response means EmailJS accepted the request, not guaranteed inbox placement.

### EmailJS contact form

1. Copy `.env.example` to `.env.local` if you need to configure another environment. The provided configured ZIP includes `.env.local`; do not commit it to Git.
2. Ensure the EmailJS dashboard has the service and template IDs matching the values in `.env.local`.
3. The contact template should use `{{from_name}}`, `{{from_email}}`, `{{reply_to}}`, and `{{message}}` (and `{{to_email}}` only if the template uses it).
4. Run `npm install` and `npm run dev`, then send a test message from the Contact section.
5. For Vercel, add the three `VITE_EMAILJS_*` values as environment variables and redeploy.

## Resume download

All resume download actions use `/Aditya_Kumar_Resume.pdf`, served from `public/Aditya_Kumar_Resume.pdf`. The file is the exact PDF supplied for this fix. Use the same URL for any future View Resume link (open in a new tab) so download and view actions always reference the same document.


## Resume and email-arrow maintenance (2026-10-15)

- Replaced `public/Aditya_Kumar_Resume.pdf` with the exact user-uploaded PDF, preserving its bytes and content.
- The existing hero Download resume anchor already points at the canonical public path and uses the filename `Aditya_Kumar_Resume.pdf`; Vite copies the public asset into the production build.
- The hero Email row and Contact section email row already use `mailto:${profile.email}`. Added explicit accessible labels to those links so the arrow remains part of the same keyboard-accessible clickable link. The configured email is read from `src/data/portfolio.js` (`official.adityakumar4005@gmail.com`).
- Email links open the visitor's configured mail application; they do not claim that an email was sent. The separate contact form still requires valid EmailJS configuration to submit.
