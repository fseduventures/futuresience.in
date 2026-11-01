# Performance rules

## Images
- `public/images` keeps the **originals** at full quality, because the print brochure (`src/brochure/`) reads them. Don't shrink or overwrite them.
- `scripts/optimize-images.mjs` runs at the end of `npm run build` and recompresses the copies in `dist/images` in place: mozjpeg q78 for JPEG, palette PNG for PNG (transparency kept). A file is replaced only when the result is smaller. Filenames don't change, so no markup changes.
  - It took the images from 5.8 MB to 3.3 MB (the director photos went from about 500 KB to 50 KB).
- New images: max 1600px wide (portraits about 600px), JPEG for photos, PNG only when transparency is needed. Below-the-fold `<img>` get `loading="lazy"`.
- WebP/`<picture>` and `width`/`height` attributes were left out on purpose. Recompression got most of the gain, and most images are sized by CSS. Revisit only if PageSpeed flags image format or layout shift.

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
