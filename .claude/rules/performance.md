# Performance rules

## Images
- `public/images` keeps the **originals** at full quality, because the print brochure (`src/brochure/`) reads them. Don't shrink or overwrite them.
- `scripts/optimize-images.mjs` runs at the end of `npm run build` and recompresses the copies in `dist/images` in place: mozjpeg q78 for JPEG, palette PNG for PNG (transparency kept). A file is replaced only when the result is smaller. Filenames don't change, so no markup changes.
  - It took the images from 5.8 MB to 3.3 MB (the director photos went from about 500 KB to 50 KB).
- New images: max 1600px wide (portraits about 600px), JPEG for photos, PNG only when transparency is needed. Below-the-fold `<img>` get `loading="lazy"`.
- WebP/`<picture>` and `width`/`height` attributes were left out on purpose. Recompression got most of the gain, and most images are sized by CSS. Revisit only if PageSpeed flags image format or layout shift.

## PageSpeed findings (Nov 2026, v6.5.2: mobile 41, desktop 93)
Check with `npx lighthouse@12 <url> --chrome-flags="--headless=new"` (add `--preset=desktop`). The PageSpeed API's free quota often runs out. Lighthouse tests the **light theme**.
- **Animate only `transform`/`opacity`.** Animating `left` (button sheen) or `width` (score bars) re-ran layout every frame on a long page: 5.7s of style/layout on mobile.
- **`main > section ~ section { content-visibility: auto }`** skips rendering below-the-fold sections, and also defers their CSS background images. Keep it, and don't add `overflow`-dependent tricks to whole sections.
- **gtag.js loads late** (first pointerdown/scroll/keydown/touch/mousemove, or 5s after `load`; see `trackers()` in `prerender.mjs`). Events wait in `dataLayer` until then. Never put a plain `<script async src=gtag>` back.
- **Preloads** (`preloads()` in `prerender.mjs`): the two latin woff2 fonts on every page (without them the fonts arriving shifted the hero text, CLS 0.135), plus the homepage hero photo with `media` queries matching the CSS breakpoint.
- **Phone images:** `optimize-images.mjs` writes `name-sm.jpg` (720px) for every JPEG wider than 900px. They're used by the hero (`--hero-img` in the 640px block) and the gallery (`smallSrc()` srcset in `Blocks.jsx`). In dev, `vite.config.js` serves the original for `-sm` URLs. A new gallery photo of 900px or less goes in `SMALL_ONLY`.
- Don't downsize palette PNGs (logos): resampling made `logo-tag.png` bigger.
- Light-theme small text uses `--lime-ink` (#4a7a16), not `--lime-600`, which fails contrast at 2.7:1. Tap targets are at least 24×24px.
- Remaining items Lighthouse lists, left on purpose: WebP, image cache over 1 month (images keep their names), DOM size (a long homepage), the 270 KB JS bundle. The live TTFB (~650ms on MilesWeb) is a hosting matter: Cloudflare.

## Caching and compression (`public/.htaccess`)
- `mod_deflate` compresses HTML, CSS, JS, JSON, XML and SVG.
- `mod_expires` caching:
  - HTML: 0s, so updates show straight away
  - hashed `/assets` CSS, JS and fonts: 1 year (Vite renames the files on every change)
  - images: 1 month (names don't change)
  - icons: 1 year
  - `robots.txt`/`sitemap.xml`: 1 day
  - anything else: 2 days

## Already handled by the build
Vite minifies CSS and JS. The module script doesn't block rendering. Fonts are self-hosted woff2 (`@fontsource`). Pages are pre-rendered HTML.

## Not a code problem
Slow time to first byte (Seobility's "response time") comes from MilesWeb hosting. The fixes are Cloudflare's free plan, LiteSpeed cache or a faster host (see `deploy.md`).
