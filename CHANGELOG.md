# Changelog

All notable changes to the futureScience website. `python release.py` turns the
Unreleased section into the next version and uses it as the GitHub Release notes.

## [Unreleased]

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
