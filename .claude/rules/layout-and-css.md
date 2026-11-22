# Layout and CSS rules

## Mobile first
- Check every change at **360px and 412px wide** (common Android phones). Nothing may overflow sideways.
- **Use `repeat(n, minmax(0, 1fr))` for grid columns, not `repeat(n, 1fr)`**, wherever a cell holds big unbreakable text such as numbers like `99.98%ile`. Plain `1fr` lets the longest word widen its column past the screen edge, which caused the cut-off homepage stats.
- Large display numbers scale with the viewport, for example `font-size: clamp(1.45rem, 7vw, 2rem)` on phones.
- Grid **items** that hold a horizontal scroller (the hero spotlight carousel) also need `min-width: 0`, or the track's full width stretches the column and the page overflows.
- When asked to add a feature to an existing section, keep that section's layout exactly as it is. Add to it; don't rearrange it.
- Header: five links (`nav` in `site.js`; Directors and Contact have `header: false`, so they're footer-only, and Enrol Now leads to Contact) plus three same-size buttons (`.nav-btn`): Brochure, Parent / Student Login (`portal` in `site.js`, external, new tab) and Enrol Now. The header container is up to 1,360px wide (the full row needs ~1,284px).
  - Breakpoints are measured, not guessed: ≥1335px everything; 1187–1334px no header Brochure button (it's in the hero, CTA band, footer and phone menu); 1061–1186px the login button reads "Login" (`.nav-long` hidden; the full label stays in the HTML); ≤1060px the menu button and drawer (their own media block).
  - After any header change, re-measure the row's natural width for each variant (brand left → `.header-tools` right, with `justify-content: flex-start`), set the breakpoints to that width + ~50px, and check each boundary width plus the phone drawer.
- Breakpoints in `styles.css`: `max-width: 980px` (tablet) and `max-width: 640px` (phone). Put phone fixes in the 640px block.

## Animation
- Animate only `transform` and `opacity`. Animating `left`, `width`, `top` or `height` forces layout on every frame (see `performance.md`).

## Look (unslop pass, Nov 2026)
Keep the site free of the usual "AI-generated" tells:
- no gradient text: `.hl` is solid lime, and `--lime-ink` in the light theme
- no coloured glows or shadows: shadows stay neutral (`--shadow`)
- no hover lifts: hover changes the surface (shadow or border), and buttons get a small press on `:active`
- labels stay in the case they're written in, with no `text-transform: uppercase` or wide tracking; the decorative exam ticker and scientists band are the exceptions
- weights up to 700
- no `transition: all`

The skill is `unslop` (plugin `unslop@heydamir`).
- **Phone action bar** (`components/ActionBar.jsx`): fixed Call / WhatsApp buttons at 640px and below. The footer gets matching bottom padding in the 640px block. Anything else fixed to the bottom of the screen on phones has to sit above it.

## Theming
- Dark is the default (`styles.css`). Light mode overrides live in `src/theme-light.css` under `[data-theme='light']`.
- **When you add or rename a selector that sets a colour, update both files.**
- Use the existing tokens (`--navy`, `--navy-900`, `--lime`, `--lime-600`, `--ink`, `--muted`, `--gold`, `--tint`, `--line`) instead of new hex values.

## Things that look like headings but aren't
- `.card-title` shares the base `h3` style (font, size, weight, colour, including inside `.section-dark`). Use it for card labels that shouldn't count as headings (see `seo.md`).
- Generic rules such as `.track p` would override `.card-title`, so write them as `.track p:not(.card-title)`.
- `.sr-only` hides text visually but keeps it for screen readers and crawlers.

## Students without photos
- `TopperCard` and `AchieverCard` show a `Monogram` (initials on navy, a DNA mark for PCB and an atom for PCM) when a student has no `photo`. When a photo arrives, add `photo: '/images/achievers/<name>.jpg'` to that student; nothing else changes.
- Small photos (the MHT-CET 2025 ones were cropped from score-card screenshots, ~110px) go on feature cards with `framed`: a ringed portrait on the navy panel instead of a blurry full-card photo. Crop just inside the photo frame, enlarge 2x with lanczos3, sharpen lightly, and save as JPEG q90. Use only the photo: never commit score cards or any other detail on them.
- Names follow the official score card's spelling.
- A new year's results: add a `cetYYYY` object like `cet2025`, a block on the Results page (newest first), the homepage ribbon, the Results meta description, the `llms.txt` lines in `prerender.mjs`, `resultsSummary` and the results FAQ in `site.js`, and `award` in `meta.js`. The brochure only changes if asked, and without years (see CLAUDE.md).

## Code style
- Follow the existing style: function components, data from `src/data/site.js`, `Icon` from `components/Icon.jsx`, and `Reveal` for scroll-in animation.
- `Counter` starts at its real value so pre-rendered HTML shows true numbers. Keep it that way.
- Comments are short and explain *why*. CSS is one rule per line in `styles.css`.
