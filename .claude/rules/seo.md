# SEO rules

These limits come from the Seobility audit of the homepage (Oct 2026). `npm run seo:check` enforces them.

## Titles and descriptions (`src/seo/meta.js`)
- **Title: max 60 characters** (Seobility measures max 580px). Put the main keywords first and the brand last: `JEE & NEET Coaching in Kandivali & Malad | futureScience`.
- **Description: max 155 characters** (max 1000px). Include one hard number (for example 99.98 %ile) and the location.
- **Every word in a title must also appear in the page text.** Don't put keywords in a title unless the page actually talks about them.
- Each page needs its own title and description, with no duplicates across pages.
- When the homepage meta changes, update the fallback in `index.html` too.

## Headings
- Exactly **one `<h1>` per page**. The homepage `<h1>` text comes from `pages['/'].h1` in `meta.js`.
- **No duplicate heading text on a page**, ignoring case. The same name or course often shows up in several sections (a hero card plus a topper card, a track plus a programme plus a batch). Only one of them may be a heading.
- **Keep the heading count proportional to the text: under 40 per page.** Small card labels (tracks, method steps, footer column titles) are not headings. Use `<p className="card-title">`, which looks like an `h3` but is not one.
- Section titles are `h2` and card titles inside a section are `h3`. Don't skip levels.

## Images
- **Every `<img>` needs a meaningful `alt`.** Use the person's name, the course title or what the photo shows. Never use `alt=""` on the website, even for small or decorative images, because Seobility counts them. The print brochure (`src/brochure/`) is exempt.
- An image that is the only content of a link supplies that link's text, so its alt must describe the destination or the people shown.

## Links
- **Every link needs readable text.** `aria-label` alone does not count for SEO.
- **Don't use the same link text for different URLs** (for example "View details" ×8 or "Directions" ×2). Keep the short visible text and add a hidden suffix:
  `View details<span className="sr-only"> of {p.title}</span>`
- Repeating the same text for the *same* URL is fine (nav plus footer, several "Enquire" buttons to `/contact`).
- Internal links use React Router `<Link to="/page">`. Canonical URLs end in `/` (see `canonical()` in `meta.js`).

## Structured data and crawlers
- JSON-LD is generated from `src/data/site.js` in `meta.js`. Edit the data, not the schema code.
- `robots.txt`, `sitemap.xml` and `llms.txt` are written by `scripts/prerender.mjs`. It pre-renders every route in `pages` in `meta.js`, so a new page needs an entry there (plus a sitemap `priority` in `prerender.mjs`).
