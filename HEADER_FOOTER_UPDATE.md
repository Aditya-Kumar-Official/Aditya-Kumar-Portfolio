> **Superseded** by the later redesign; see the README section "Header, portrait, footer and icons".

# Header, Footer & Portrait Detail Update

## Design references reviewed
- Awwwards' portfolio and header/footer inspiration collections: https://www.awwwards.com/inspiration_search/copy-design/ and https://www.awwwards.com/inspiration/for-moments-like-no-other-footer
- Giats portfolio on Awwwards: https://www.awwwards.com/sites/https-giats-me
- Developer portfolio examples: https://www.wearedevelopers.com/magazine/561-web-developer-portfolio-inspiration-and-examples-march-2025

## Applied design decisions
- Kept the portrait treatment simple, adding only two tiny accent marks in the empty space around the photo. No elements overlap the photograph.
- Made the header sticky with a restrained translucent surface and blur so navigation remains available while scrolling.
- Added a subtle accent underline on navigation hover/focus, while preserving the existing theme switcher, command palette, and mobile menu.
- Reworked the footer into a clear brand/message row and a secondary navigation row with Projects, Skills, Contact, GitHub, LinkedIn, and Back to top.
- Kept the existing mini terminal feature and its open/closed state visible to assistive technology.
- Added mobile layout rules and retained visible focus styling and reduced-motion support.

## Verification
- ZIP integrity: checked after packaging.
- Static CSS brace balance and source-level link/handler review: checked.
- Production build and browser interaction tests: not run because dependencies are not installed in this environment and package registry access previously timed out. Run `npm install`, `npm run build`, and `npm run dev` locally before deployment.
