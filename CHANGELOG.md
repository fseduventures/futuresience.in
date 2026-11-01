# Changelog

All notable changes to the futureScience website. `python release.py` turns the
Unreleased section into the next version and uses it as the GitHub Release notes.

## [Unreleased]

## [1.1.0] - 2026-11-01

### Added
- Google Analytics 4 on every page, with phone, WhatsApp and email taps reported as `generate_lead` (Meta Pixel ready, switched off until an ID is set)
- Instagram, Facebook and LinkedIn links in the footer and in the structured data (`sameAs`)
- Site version shown in the footer, the header top bar (desktop) and a `<meta name="version">` tag
- `release.py` to bump the version, build, tag, push and publish a GitHub Release with the upload zip

### Changed
- Build recompresses images in `dist/images` (5.8 MB → 3.3 MB); originals stay full quality for the brochure
- Longer browser caching for WebP, GIF, SVG, icons, sitemap and robots.txt

## [1.0.0] - 2026-10-31

### Added
- First release of the Vite + React static site, pre-rendered for SEO
