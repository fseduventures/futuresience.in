# futureScience website

Static marketing site for **futureScience Private Tutorials** (Class 11–12 science coaching, Kandivali West & Malad West, Mumbai).
Vite + React + React Router, pre-rendered to plain HTML per page so search engines and AI assistants read it without JavaScript.
Live at https://www.futurescience.in on cPanel (MilesWeb, Apache/LiteSpeed). There is no backend.
Git repo: github.com/fseduventures/futuresience.in (branch `main`, releases tagged `vX.Y.Z`, current line 6.x).

## Commands (PowerShell)
- `npm run dev`: dev server at http://localhost:5173
- `npm run build`: build + pre-render into `dist/`
- `npm run seo:check`: audits every page in `dist/` for the issues Seobility flags. **Run it after every build that touches content, markup or SEO, and fix anything it reports.**
- `npm run release`: brochure PDFs + website build
- `python release.py --patch|--minor|--set-version X.Y.Z`: version bump, build, seo:check, tag, push, GitHub Release and an upload zip in `release-dist/` (see `deploy.md`)

## Where things live
- `src/data/site.js`: **all content** (stats, programmes, batches, branches, toppers, FAQs, contact). The site, the JSON-LD, `llms.txt` and the brochure all read from it.
- `src/seo/meta.js`: page titles, meta descriptions, the homepage `<h1>`, keywords and schema.org data
- `index.html`: fallback `<title>`/description; keep it identical to the homepage entry in `meta.js`
- `src/pages/*.jsx`: one file per page. `src/components/Blocks.jsx` holds the shared cards and sections.
- `src/styles.css` (dark default) + `src/theme-light.css` (light-theme overrides; update both together)
- `scripts/prerender.mjs`: writes `dist/<page>/index.html`, sitemap, robots, `llms.txt`, plus the analytics tags and `<meta name="version">`
- `scripts/optimize-images.mjs`: recompresses `dist/images` after the build (originals in `public/images` stay untouched)
- `src/analytics.jsx`: GA4 / Meta Pixel events (leads, brochure downloads, theme). IDs are in `analytics` in `site.js`.
- `CHANGELOG.md` + `release.py`: versioning. The version comes from `package.json` and shows in the header and footer.
- `public/.htaccess`: HTTPS + www redirect, charset, compression, caching, header hardening
- `src/brochure/`: the print brochure (separate build, see README)

## Rules
Detailed rules are in `.claude/rules/`:
- `seo.md`: titles, descriptions, headings, alt text, links (the limits Seobility enforces)
- `layout-and-css.md`: mobile layout, theming, heading-styled non-headings
- `deploy.md`: versioning, release steps, server headers and off-site SEO work
- `analytics.md`: GA4/Pixel setup, the event list, GA4 admin steps
- `performance.md`: image optimisation, caching, compression

For a pasted Seobility/SEO report, follow `.claude/skills/seo-audit/SKILL.md`.
To cut a release, follow `.claude/skills/release/SKILL.md`.
