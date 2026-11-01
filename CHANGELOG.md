# Changelog

All notable changes to the futureScience website. `python release.py` turns the
Unreleased section into the next version and uses it as the GitHub Release notes.

## [Unreleased]

## [6.5.3] - 2026-11-01

### Changed
- Faster on phones (Lighthouse mobile 41 → 86 in local tests, layout shift 0.135 → 0, accessibility 96 → 100):
  - Google Analytics loads on the first tap or scroll (or 5s after load) instead of during page load
  - fonts and the hero photo are preloaded, and phones get a 720px hero photo and gallery images
  - sections below the hero are only rendered when scrolled near
  - the button shine and score-bar animations no longer force layout on every frame
- Every `npm run build` also writes `dist-build.zip`, the upload file for cPanel (`.htaccess` included); releases attach the same zip
- Darker green for small light-theme text (Achievers label, active menu item, footer tagline) to meet contrast guidelines; larger tap areas on the Topper Spotlight dots

## [6.5.2] - 2026-11-01

### Added
- Topper Spotlight on the homepage is now a carousel: Lyra Uchil, Tvisha Vedant, Shrey Soni and Atharv Vedant. It auto-advances every 5 seconds, can be swiped on phones, and pauses on hover or touch.
- Privacy Policy page (`/privacy/`), linked from the footer only

## [6.4.1] - 2026-11-01

### Added
- Every GA4 page view and event carries the visitor's theme (`site_theme`: dark / light), plus a `theme_change` event when someone flips the toggle
- Project rules for analytics, performance and versioning, and a `release` skill

## [6.4.0] - 2026-11-01

### Added
- Google Analytics 4 on every page, with phone, WhatsApp and email taps reported as `generate_lead` (Meta Pixel ready, switched off until an ID is set)
- Brochure downloads tracked as `brochure_download` in GA4, with the button location (header, footer, page) and edition (dark, light)
- Instagram, Facebook and LinkedIn links in the footer and in the structured data (`sameAs`)
- Site version shown on the website only (footer, header top bar on desktop, `<meta name="version">`), not in the brochure
- `release.py` to bump the version, build, tag, push and publish a GitHub Release with the upload zip

### Changed
- Build recompresses images in `dist/images` (5.8 MB → 3.3 MB); originals stay full quality for the brochure
- Longer browser caching for WebP, GIF, SVG, icons, sitemap and robots.txt

## [1.0.0] - 2026-10-31

### Added
- First release of the Vite + React static site, pre-rendered for SEO
