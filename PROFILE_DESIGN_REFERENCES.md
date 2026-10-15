> **Superseded.** The scene-mode ("Background") control and pointer-light stage described below were removed in the header/portrait/footer redesign. See the README section "Header, portrait, footer and icons".

# Profile hero design research

This refresh uses design principles observed in these public portfolio references, without copying their code or replacing this project's identity/assets:

- **Bruno Simon / interactive creative portfolios** — make interaction itself the demonstration, but keep the primary experience understandable. Reference roundup: https://www.hoverstate.design/best-portfolio-websites
- **Awwwards 0110 Studio interactive 3D page** — restrained ambient atmosphere and deliberate interactive scene rather than static decoration: https://www.awwwards.com/inspiration/3d-page-for-3d-animations-0110-studio-portfolio-web
- **David Heckhoff portfolio reference** — clean layout and micro-interactions around a clear focal point: https://step1.dev/gallery/TqiTh--OQ5f5QI2aj-BFj
- **Awwwards portfolio implementation example** — use motion as a supporting layer, not a reason to sacrifice usability: https://github.com/Ali-Sanati/awwwards-portfolio

## Applied decisions

- Kept the existing profile photograph and its portrait crop.
- Removed the prior oversized orbit/ambient composition and the interactive status card under the image.
- Used a cleaner editorial portrait frame with a subtle theme-aware atmospheric canvas.
- Added three accessible scene modes (Aurora, Blueprint, Minimal) below the photo. Controls are outside the image and visibly indicate the selected state.
- Pointer-following light only affects the background; no overlay or control covers the photograph.
- Added reduced-motion behavior and responsive controls; no new dependency or WebGL renderer was introduced.

## Verification status

JSX syntax and asset/ZIP checks are run during packaging. Full Vite production build is not verified if npm dependency installation cannot complete in this environment; run `npm install` and `npm run build` locally to confirm.
