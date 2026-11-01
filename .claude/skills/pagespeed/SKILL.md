---
name: pagespeed
description: Read a PageSpeed Insights / Lighthouse report (pasted, screenshot or pagespeed.web.dev link) for the futureScience site and fix the speed, accessibility and best-practice issues without changing the layout. Use when the user shares a PageSpeed link or score, or asks to make the site faster.
---

# PageSpeed workflow

1. **Read** `.claude/rules/performance.md` (PageSpeed findings) and `.claude/rules/layout-and-css.md`. The layout must not change; fix how things load and animate, not how they look.
2. **Get the data.** pagespeed.web.dev pages need JavaScript and can't be fetched. Try the API first:
   `curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://www.futurescience.in/&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo"`
   If it returns 429 (shared quota), run Lighthouse locally. It's the same engine:
   `CHROME_PATH="/c/Program Files/Google/Chrome/Application/chrome.exe" npx -y lighthouse@12 https://www.futurescience.in/ --output=json --output-path=<scratchpad>/lh-mobile.json --chrome-flags="--headless=new"` (add `--preset=desktop` for desktop). Write the JSON to the scratchpad, never the repo.
3. **Check the live version** (`curl -s https://www.futurescience.in/ | grep 'name="version"'`) against `package.json`. If the live site is older, the report may already be fixed in code, so say so.
4. **Read the metrics, not the suggestion list.** The score comes from FCP, LCP, TBT, CLS and Speed Index. For each weak metric, look at its detail audits:
   - `largest-contentful-paint-element` (the phases)
   - `layout-shifts` / `cls-culprits-insight` (the cause, for example "Web font loaded")
   - `bootup-time`, `mainthread-work-breakdown` and `third-party-summary` (TBT)
   - `color-contrast` and `target-size` for accessibility
5. **Fix at the source,** following the patterns already in place:
   - animate only `transform` and `opacity`
   - preloads go in `preloads()` in `prerender.mjs`
   - third-party scripts load late, like gtag in `trackers()`
   - phone images use `-sm` copies from `optimize-images.mjs`
   - light-theme text colours use the `--*-ink` tokens
6. **Verify:** `npm run build`, `npm run seo:check`, then `npx vite preview --port 4173` and Lighthouse on `http://localhost:4173/` twice (the first run is cold). Compare with the live baseline. Check 360px and desktop screenshots (headless Chrome's window can't go below ~500px, so render 360/412px inside an iframe page) to confirm the layout is unchanged.
7. **Record** new lessons in `performance.md` (and `layout-and-css.md` for CSS rules) and add a `CHANGELOG.md` entry.
8. **Report:** a before → after table of the scores and metrics, what changed, what was left alone and why (diagnostics that don't affect the score, hosting TTFB), and any trade-off such as analytics loading late. The build wrote `dist-build.zip` to upload, or offer to release.
