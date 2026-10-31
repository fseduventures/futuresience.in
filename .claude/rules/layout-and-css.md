# Layout and CSS rules

## Mobile first
- Check every change at **360px and 412px wide** (common Android phones). Nothing may overflow sideways.
- **Use `repeat(n, minmax(0, 1fr))` for grid columns, not `repeat(n, 1fr)`**, wherever a cell holds big unbreakable text such as numbers like `99.98%ile`. Plain `1fr` lets the longest word widen its column past the screen edge, which caused the cut-off homepage stats.
- Large display numbers scale with the viewport, for example `font-size: clamp(1.45rem, 7vw, 2rem)` on phones.
- Breakpoints in `styles.css`: `max-width: 980px` (tablet) and `max-width: 640px` (phone). Put phone fixes in the 640px block.

## Theming
- Dark is the default (`styles.css`). Light mode overrides live in `src/theme-light.css` under `[data-theme='light']`.
- **When you add or rename a selector that sets a colour, update both files.**
- Use the existing tokens (`--navy`, `--navy-900`, `--lime`, `--lime-600`, `--ink`, `--muted`, `--gold`, `--tint`, `--line`) instead of new hex values.

## Things that look like headings but aren't
- `.card-title` shares the base `h3` style (font, size, weight, colour, including inside `.section-dark`). Use it for card labels that shouldn't count as headings (see `seo.md`).
- Generic rules such as `.track p` would override `.card-title`, so write them as `.track p:not(.card-title)`.
- `.sr-only` hides text visually but keeps it for screen readers and crawlers.

## Code style
- Follow the existing style: function components, data from `src/data/site.js`, `Icon` from `components/Icon.jsx`, and `Reveal` for scroll-in animation.
- `Counter` starts at its real value so pre-rendered HTML shows true numbers. Keep it that way.
- Comments are short and explain *why*. CSS is one rule per line in `styles.css`.
