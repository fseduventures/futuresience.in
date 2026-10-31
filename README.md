# futureScience: static React website + print brochure

Display-only (no backend) site for **futureScience Private Tutorials**, built with Vite + React + React Router.
Every page is pre-rendered to plain HTML at build time so Google and AI search assistants
(ChatGPT, Perplexity, Claude, Gemini) can read the full content without running JavaScript.

## Commands

```powershell
cd D:\futureScience\new-site
npm install          # first time only
npm run dev          # live-reload dev server        -> http://localhost:5173
npm run release      # brochure PDFs + share image, then website build  (use this before uploading)
npm run build        # website only: builds + pre-renders into ./dist
npm run brochure     # brochure only (PDFs, public/downloads copy, og-image)
npm run preview      # serve ./dist                   -> http://localhost:4173
npm run seo:check    # audit ./dist for title/description length, headings, alt text, link text
```

## Edit content

Everything (text, batches, branches, results, FAQs, contact) is in **`src/data/site.js`**.
The website, the SEO data (schema.org JSON-LD, sitemap, `llms.txt`) and the brochure all read from it,
so after editing run `npm run release` and upload `dist/` again.

Page titles and descriptions for search results are in `src/seo/meta.js`.

## SEO / AI-search setup

- Pre-rendered HTML for `/`, `/about/`, `/courses/`, `/results/`, `/directors/`, `/contact/` (+ a real `404.html`)
- Per-page `<title>`, meta description, canonical URL, Open Graph / Twitter cards (`public/images/og-image.png`)
- JSON-LD: EducationalOrganization, both branches as LocalBusiness, every Course with batch start dates, FAQPage, BreadcrumbList
- `robots.txt` (explicitly allows AI crawlers), `sitemap.xml`, `llms.txt` (a plain-text brief for AI assistants)
- `.htaccess`: forces `https://www.` (one canonical address), compression, caching, real 404s

## Brochure

`npm run brochure` writes to `brochure/`:
- `futureScience-Brochure-A3-Booklet-12pg-PRINT.pdf`: give this to the printer (3 × A3 sheets, duplex, fold + centre-pin)
- `illustrator/*.ai`: one editable Illustrator file per A3 side (live text, vector shapes); install the fonts in `illustrator/fonts` first, see `illustrator/README.txt`
- `futureScience-Brochure-A4-12pages.pdf`: reading copy; also published as `/downloads/futureScience-Brochure-2027-29.pdf`

Page order lives in `ORDER` in `src/brochure/Brochure.jsx`; keep it a multiple of 4 and the A3 imposition follows automatically.
Photos from the 2023–25 prospectus were extracted with `scripts/pdf-tools/` and `scripts/prepare-prospectus-images.ps1`.

Close the PDFs in your viewer before regenerating, otherwise Windows locks the files.

## Uploading to cPanel
Upload the **contents** of `dist/` (including the hidden `.htaccess`) into `public_html`.
