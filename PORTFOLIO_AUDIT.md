# Resume Download & Email Arrow Fix — Audit

## Findings
- Framework/build: React 18 + Vite 6.
- Resume action found: hero Download resume anchor in `src/App.jsx`, using `/Aditya_Kumar_Resume.pdf` and `download="Aditya_Kumar_Resume.pdf"`.
- Root cause for the wrong resume: the existing `public/Aditya_Kumar_Resume.pdf` was a different/default asset than the PDF supplied with this request. It has now been replaced byte-for-byte with the uploaded PDF.
- Email arrow in the screenshot corresponds to the arrow icon inside the Email link in the hero social links. That link already had a `mailto:` destination based on `profile.email`; the arrow is a decorative child of the same anchor, not a separate control. Added an explicit accessible label to the link and to the email row in Contact.
- Configured contact email is `official.adityakumar4005@gmail.com` in `src/data/portfolio.js`.
- The Contact form is separate from the Email link and uses EmailJS. It reports an honest configuration error when the required environment variables are missing.

## Files changed
1. `public/Aditya_Kumar_Resume.pdf` — replaced with the exact uploaded resume PDF.
2. `src/App.jsx` — added accessible labels to hero/contact email links; no visual redesign.
3. `README.md` — documented the canonical resume path and behavior.

## Verification
- Confirmed the supplied PDF exists and copied it to the public asset path.
- Confirmed the app's existing resume anchor points to the canonical asset and provides the professional download filename.
- Confirmed the hero and contact email links use the configured email via `mailto:`.
- Production build/browser interaction tests depend on installing dependencies and running the app in a browser; do not treat those as completed unless run in the target environment.

## Deploy
- Commit/push these changes and redeploy the Vite site.
- On Vercel, use build command `npm run build` and output directory `dist`.
- After deployment, test `https://YOUR_DOMAIN/Aditya_Kumar_Resume.pdf` directly, click Download resume, and click the Email row. Email behavior depends on the visitor having a mail application or browser handler configured.
- If the Contact form should send messages directly, set `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY` in the hosting provider, then redeploy.
