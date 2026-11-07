# Deploy and off-site SEO

## Versioning
- The version lives in `package.json` (single source of truth). `vite.config.js` injects it as `__APP_VERSION__`, which is exported as `VERSION` from `site.js`.
- It shows **on the website only**: in the footer bottom line, in the header top bar (desktop, hidden at 640px and below) and in `<meta name="version">`. The brochure never shows it.
- Semver, starting from **6.4.0** (2026-11-01):
  - patch: content updates and fixes
  - minor: new sections or features
  - major: a redesign
- `CHANGELOG.md` (repo root) has a `## [Unreleased]` section. Add a bullet to it with every change.

## Upload file
Every `npm run build` ends with `scripts/zip-dist.mjs`, which writes **`dist-build.zip`** at the project root (gitignored). It holds the contents of `dist/` at the zip's root, `.htaccess` included, so it extracts straight into `public_html`. After any build, point the user to this file. Don't ask them to upload the `dist/` folder by hand.

## Presentation (`npm run deck`)
- `scripts/make-deck.mjs` builds `deck/futureScience-Presentation.pptx` from `site.js`. It's a presentation **about futureScience**, like the brochure, not a website tour. 15 frames: title, about, top results, merit list, legacy, directors, method, Advantage, courses ×2, admissions, testimonials, alumni, Life at fS, contact.
- The frames sit on one canvas, five per row in a snake. Every slide carries the whole canvas with each object named `!!f<frame>-<key>`, so Morph moves the "camera": title → overview → each frame → overview → contact. Hold time per frame comes from its word count (`T` at the top of the file).
- Morph and `advTm` auto-advance are added to the slide XML afterwards (pptxgenjs can't write them), and images are de-duplicated.
- Results show **without passing years** (`noYear`), as in the brochure. Testimonials keep theirs.
- Fonts: Sora and Inter are used only if installed on the PC; otherwise Segoe UI. A **missing** font makes PowerPoint repeat words at line breaks. To get the brand fonts, install `brochure/illustrator/fonts/*.ttf` and run `npm run deck` again.
- Check a change by opening the file in PowerPoint (COM `Presentations.Open`) and exporting slides as PNG. PowerPoint refuses objects ~170in off the slide, so keep the canvas compact.

## Release checklist
1. Brochure changed? Run `npm run brochure` first and commit the PDFs. Close any open brochure PDFs first, because Windows locks them.
2. Add the changes to `## [Unreleased]` in `CHANGELOG.md` and commit everything (the script refuses a dirty tree).
3. Run `python release.py --patch|--minor|--major` (or `--set-version X.Y.Z`; `--dry-run` previews). It:
   - bumps `package.json` and `package-lock.json`
   - dates the changelog
   - runs `npm run build` and `npm run seo:check` (rolling back if either fails)
   - copies the build's `dist-build.zip` to `release-dist/futurescience-site-vX.Y.Z.zip` (gitignored, includes `.htaccess`)
   - runs `npm run deck` and copies the presentation to `release-dist/futurescience-presentation-vX.Y.Z.pptx` (if it fails, for example because it's open in PowerPoint, the release carries on without it)
   - commits "Release vX.Y.Z", adds an annotated tag and pushes both to `origin` (github.com/fseduventures/futuresience.in)
   - creates the GitHub Release with the changelog notes, the zip and the deck attached
4. The GitHub Release step needs `gh` (installed at `C:\Program Files\GitHub CLI`) and a one-time `gh auth login --web`. If it was skipped, run `python release.py --publish vX.Y.Z`.
5. In cPanel File Manager, upload the zip to `public_html`, **Extract** (overwrite) and delete the zip. It already contains `.htaccess`. Then **clear the nginx cache**: cPanel → search "NGINX" → *NGINX Manager* → **Clear Cache**. Otherwise cached responses can keep serving the old version. Then check that the footer shows the new version.
6. Re-run Seobility on https://www.futurescience.in/ (and any changed page) to confirm.

Never move or delete a pushed tag to "fix" a version. Release the next version instead. (The one exception: `v1.1.0` was abandoned before any GitHub Release and replaced by `v6.4.0`, so the user may delete it.)

## Server (`public/.htaccess`)
- `AddDefaultCharset UTF-8` sends the charset in the HTTP header (a Seobility check).
- `ServerSignature Off` plus `Header unset Server` hide the server version. This works on LiteSpeed. On plain Apache the host must set `ServerTokens Prod` in the main config, and `.htaccess` can't do it.
- **MilesWeb puts an nginx cache in front of Apache** (checked Nov 2026). Pages Apache serves send `Server: Apache` (no version, passes). Responses from the nginx cache (`X-Server-Cache: true`) send `Server: nginx/1.25.5`, which is Seobility's "web server version" warning. `.htaccess` can't reach nginx. The fixes:
  - MilesWeb support sets `server_tokens off;` in nginx (keeps the cache)
  - or Cloudflare in front (sends `Server: cloudflare` and also fixes response time)
  - or turn off the nginx cache in cPanel (slower, so not recommended)
- The same nginx layer answers unknown URLs with the 404 page but a **200 status** (a "soft 404"; Apache's `ErrorDocument 404` is bypassed). Ask MilesWeb to return a real 404 there too. Check with `curl -sI https://www.futurescience.in/nope-404`.
- Response time (Seobility wants under 0.4s, it was 0.72s) depends on the hosting, not the code. Options: Cloudflare free plan in front of the site, LiteSpeed cache, or a faster host.
- Keep the HTTPS + `www.` redirect; it gives every page one canonical address.

## Off-site (the code can't fix these)
"External factors" scored 3% because only one domain links to the site. Work on backlinks:
- Google Business Profile for **each** branch (Kandivali West, Malad West) with the website link
- Listings on Justdial, Sulekha, UrbanPro and IndiaMART
- The website link in the Instagram, Facebook and LinkedIn bios. These are already in `contact.socials` in `site.js` (footer plus `sameAs`). YouTube is still empty, and there's no Twitter/X account.
- Links from partner schools and junior colleges, and local news coverage of results
