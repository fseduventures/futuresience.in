# Changelog

All notable changes to the futureScience website. `python release.py` turns the
Unreleased section into the next version and uses it as the GitHub Release notes.

## [Unreleased]

## [7.0.0] - 2026-11-28

### Changed
- IIT and Medical positioning everywhere: homepage title, `<h1>` and description (and the `index.html` fallback), the About, Courses, Results, Directors, Contact and Life titles or descriptions, the keywords, the hero and footer copy, and the `llms.txt` intro.
- The Bridge Course is now the **Class XI Foundation Course** and starts on 5 April 2027; the JEE Main / MHT-CET (PCM) and NEET-UG / MHT-CET (PCB) batches start on 24 May 2027 (website, FAQs and brochure).
- Rebranded as **futureScience IIT-Medical Academy** (was futureScience Private Tutorials): site text, page descriptions, JSON-LD (old name kept as `alternateName`), `llms.txt`, `robots.txt` and the presentation.
- New logo in the header and footer: an animated GIF (`logo-academy.gif`, 192 KB, 13.6s loop) that alternates the IIT-Medical Academy and Private Tutorials logos, built by `scripts/make-logo-gif.py` from the logo PDF in `scripts/logo-src/`. Visitors with reduced motion get the still Academy PNG, which is also the JSON-LD logo. Map links still search the old name, which the Google listings use.

### Added
- Atharv Vedant's JEE Main 2024 result (97.67 percentile, qualified for JEE Advanced) beside his MHT-CET 2024 result on his topper card (two columns; stacked on phones), in the results FAQ and in `llms.txt`.
- Atharv's JEE Main 2024 result on his homepage spotlight slide (split: MHT-CET 2024 beside JEE Main 2024), the hero line, the homepage results lead and the Results page description.
- Discover-U, a career interest assessment (100 questions, about 30 minutes), listed after STEMQUEST on the Courses page and in the brochure.
- Brochure: the IIT-Medical Academy logo on the cover and the social share image; the back page keeps the original Private Tutorials logo.
- Presentation: the logo is an animated GIF (`scripts/logo-src/logo-academy-deck.gif`) that starts and ends on the finished Academy logo, because PowerPoint restarts a GIF on every slide.

## [6.9.0] - 2026-11-22

### Changed
- Design polish (unslop pass; same colours, fonts and layout):
  - Highlighted heading words are solid lime (light theme: the darker `--lime-ink` green) instead of gradient text.
  - No lime glow under the primary buttons.
  - Cards and buttons no longer jump up on hover. Cards get a soft shadow or lime edge, and buttons a small press.
  - Big numbers use weight 700 instead of 800.
  - Labels (eyebrows, timeline years, director titles, badges, course facts) are no longer upper-case with wide letter spacing.
- Copy that the site couldn't back up is now specific:
  - The hero leads with the MHT-CET 2025 top score (99.97 %ile).
  - Online classes aren't offered now:
    - The homepage line "Online classes as good as the best offline classroom" is removed.
    - The "Online & offline" promise card is now **A structured week** (classes 4 days a week, 6 hours a day, plus a revision day and a test day).
    - `llms.txt` says the coaching is classroom-based.
  - New facts:
    - The weekly schedule and the test pattern (weekly chapter-wise tests, cumulative tests and prelims, in subjective and objective patterns), with two new FAQs.
    - Branch shifts, Kandivali West mornings and Malad West afternoons, on the branch cards, in the branch FAQ, the JSON-LD and `llms.txt`.
  - The directors' LinkedIn profiles are in the JSON-LD (`sameAs`) and `llms.txt` only. The Directors page is unchanged.
  - Lyra Uchil's MHT-CET 2024 rank is marked as **overall** Rank 2, Mumbai University.
  - Shrey Soni's NEET-UG result (630/720, 99.36 percentile) now carries its year, 2020, on the website, in the Results meta description, the FAQ, the timeline and `llms.txt`. The brochure and presentation still show it without the year.
  - "100% qualified" and "Rank 2, Mumbai University" now say 2024.
  - "Top of the merit list", "same day" doubts, "round-the-clock" and "Revered across Mumbai" are replaced with what the site shows.
  - The homepage results heading now names the exams.
  - Enquiry form: "Book a free counselling session" and "Send on WhatsApp".
- Structured data:
  - FAQPage marks up only the questions each page shows (homepage 14, Courses 12, Contact 5).
  - Each director is one `Person` node (`founder` and `employee` point to it; `mainEntity` of /directors/).
  - Removed: `award`, which listed student scores; `priceRange`, since fees aren't published; and the unconfirmed "Online" course mode.
- Facts published: founded 2018, at most 25 students per batch, a team of 15+ teachers led by senior faculty with 20+ years of experience. They appear in the JSON-LD (`foundingDate`), `llms.txt`, two new FAQs, and the "Small, focused batches" card. Fees stay unpublished. The founding year also appears on the About page ("Our Story"), in the Nilesh Vedant profile, in the "Who leads futureScience?" FAQ and as `founder` in the JSON-LD. Brochure PDFs regenerated.
- Kandivali West branch: the full address from the Google listing (LG-124, Lower Ground Floor, Xth Central Mall, Boraspada Road) on the Contact page card, in the JSON-LD and in `llms.txt`, plus the map pin coordinates (`GeoCoordinates`). The footer and brochure keep the short address.
- FAQ "What results have futureScience students achieved?" now leads with MHT-CET 2025 (Aarna Diwan, 99.97 percentile, plus the three other students above 99, by name).
- The futureScience presentation is now cinematic and photo-led: 19 full-screen photo scenes. Each new photo dissolves in, then the title flies in, then cards, portraits and figures pop in, followed by a slow Ken Burns drift. It has ringed topper portraits, Life at fS photos and a call to action with a QR code. About 3¾ minutes, in the brand fonts. The director scenes are left out for now.

### Added
- AI assistant / agent readiness (GEO):
  - `llms.txt` now opens with a "Last updated" date and lists opening hours, a map link per branch, a **How to enquire** section with ready-to-send WhatsApp links per branch, and **Results at a glance** (each year's top score and every student at 99+ percentile, by name). Results are listed newest first (MHT-CET 2025 at the top).
  - Every page carries a `WebPage` JSON-LD block with `dateModified`. It and the sitemap `lastmod` now use the date content last changed (the last git commit touching content, or today if content has uncommitted changes) instead of every build's date.
- **Call / WhatsApp bar on phones** (640px and below): fixed to the bottom of every page, so parents can call or WhatsApp in one tap while scrolling. Both links count as leads automatically. The footer is padded so nothing hides behind it.
- Enquiries (from a marketing-skills audit: ai-seo, seo-audit, schema, cro, copywriting):
  - Direct WhatsApp links: "Chat on WhatsApp" on the Contact page phone card, and a WhatsApp button on each branch card.
  - Every "Book counselling" and "Enquire" button goes straight to the enquiry form (`/contact/#enquiry`). Course and batch buttons preselect that course in the form (`?course=<id>`).
  - Sending the form is now counted as a lead (`generate_lead`, `method: form`). The Privacy page says so (updated 22 November 2026).
  - New `facts` in `site.js` (founding year, maximum batch size, faculty, fees per course) and `geo` per branch. They are empty for now; once filled in they appear automatically in the JSON-LD (`foundingDate`, `GeoCoordinates`, course `Offer`), in `llms.txt` and as new FAQs.
- `npm run video` (`scripts/export_video.py`): exports the presentation to MP4 with PowerPoint (1080p or 4K). `python release.py --with-video` attaches the video to the GitHub Release.

## [6.8.0] - 2026-11-21

### Added
- **Parent / Student Login** button in the header (opens https://fsadmin.truwise.in/install in a new tab), also in the phone menu and the footer.

### Changed
- Header: Directors and Contact moved to the footer (Enrol Now already leads to Contact); Brochure, Login and Enrol Now are the same size; more space between the logo and Home; the header row may use up to 1,360px. Breakpoints measured: everything from 1335px, no header Brochure button below that, "Login" below 1187px, menu button at 1060px and below.
- Brochure, dark edition, cover: the photo in the upper third shows through 60% more (same gradient); the text area is unchanged. PDFs regenerated.

### Fixed
- Google Search Console indexing issues:
  - every internal link now points straight at the canonical slash URL (`/courses/` rather than `/courses`, which redirected), and `seo:check` guards against regressions
  - pages are pre-rendered at their slash address, so the menu's active link is in the HTML
  - `/index.html` and `/<page>/index.html` redirect to the clean URL
  - the bare `/images/`, `/assets/` and `/downloads/` folders return 404 instead of 403

## [6.7.0] - 2026-11-07

### Added
- Diwali 2026 album (6 photos) in the Celebrations section of the Results page, as a mosaic above the gallery. Website only; the brochure is unchanged.
- **Life at futureScience** page (`/life/`): every festival album plus the gallery. Linked from the header menu ("Life at fS", so on every page and in the footer) and with a "See life at futureScience" button under the galleries on Home, About and Directors and in the Results page Celebrations section.
- **futureScience presentation** (`npm run deck`): a Prezi-style PowerPoint about futureScience, built from the same data as the website and brochure. 15 designed frames (about, results, legacy, directors, method, courses, admissions, testimonials, alumni, Life at fS, contact) on one canvas, with Morph camera moves and preset reading times (about 3 minutes), ready for *Create a Video*. Regenerated and attached to the GitHub Release on every release.

### Changed
- The tests photo is now a real exam-hall photo (replacing an Instagram screenshot), with the caption "Regular tests, real exam conditions" instead of mentioning Sunday: in the website gallery, the homepage classroom collage and the brochure (regenerated).
- Diwali 2026 album: the class photo added (camera watermark strip cropped off, enhanced); "A sweet tradition" removed as a near-duplicate.
- Header: menu links never wrap; the Brochure button in the header shows from 1321px (it's still in the hero, CTA band and footer); tighter menu spacing between 981 and 1100px.

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
