---
name: seo-audit
description: Fix issues from a Seobility (or similar) SEO report or screenshot for the futureScience site, and audit the built pages. Use when the user pastes an SEO report, a score screenshot, or asks to improve SEO.
---

# SEO audit workflow

1. **Read the rules first:** `.claude/rules/seo.md` and `.claude/rules/layout-and-css.md`.
2. **Reproduce locally:** `npm run build`, then `npm run seo:check`. Compare its output with the report.
   - If the report flags something the checker passes, the live site is probably older than the code. Remind the user to deploy, and don't "fix" it twice.
   - If the report finds a new kind of problem, add a check for it to `scripts/seo-check.mjs`.
3. **Sort each item into one of three groups:**
   - *Code*: titles, descriptions, headings, alt text, link text, mobile layout. Fix it.
   - *Server*: HTTP headers, charset, compression. Edit `public/.htaccess` and say whether it needs the host's help.
   - *Performance*: page size, images, caching. See `.claude/rules/performance.md`; most of it is already handled at build time.
   - *Off-site*: backlinks, response time from hosting. Explain what the user can do (see `.claude/rules/deploy.md`). Don't pretend code fixes it.
4. **Fix at the source:** content in `src/data/site.js`, meta in `src/seo/meta.js` (+ `index.html` fallback), and markup in `src/pages` or `src/components/Blocks.jsx`. Never edit `dist/`.
5. **Verify:** rebuild, `npm run seo:check` → "All pages pass". For layout fixes, check widths of 360px and 412px.
6. **Report back** as a short before → after table. List what still needs the user (deploy, hosting, backlinks).
