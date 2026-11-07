# Changelog

All notable changes to the futureScience website. `python release.py` turns the
Unreleased section into the next version and uses it as the GitHub Release notes.

## [Unreleased]

### Added
- Diwali 2026 album (6 photos) in the Celebrations section of the Results page, as a mosaic above the gallery. Website only; the brochure is unchanged.

## [6.6.0] - 2026-11-07

### Added
- MHT-CET 2025 results (7 students, led by Aarna Diwan 99.97 %ile PCB and Param Shah 99.41 %ile PCM):
  - a new block at the top of the Results page, with feature cards for the PCB and PCM toppers and the rest in the achiever row
  - a "New · MHT-CET 2025" ribbon in the homepage results section (swipeable on phones)
  - photos for all seven students, cropped from their score cards (only the photo is used), with names as on the score cards; the PCB and PCM toppers show theirs as a ringed portrait on the navy panel. A future student without a photo gets a monogram (initials on navy with a DNA or atom mark)
  - the Results page description and `llms.txt` updated
  - the brochure (dark and light, PDFs and Illustrator files): the 2025 students join the Achievers page, which now shows 12 achievers in two rows of six, highest first, without years

### Fixed
- Score counters could flash a negative number (e.g. "-0.39") on their first animation frame

## [6.5.4] - 2026-11-01

### Changed
- Brochure shows students' results without their passing years (cover toppers, stats, Achievers page, Then & Now); testimonials keep theirs. The website is unchanged. PDFs regenerated.

### Fixed
- The brochure source (`src/brochure/`) is now tracked in git; the `brochure/` ignore rule for the generated PDFs had been matching it too

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
