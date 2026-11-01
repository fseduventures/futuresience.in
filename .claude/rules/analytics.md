# Analytics rules

## Setup
- IDs live in `analytics` in `src/data/site.js`. An empty ID means that tracker isn't loaded at all.
  - `ga4: 'G-6C9RV8YZ4W'` (GA4 property "futureScience.in", stream ID 16246595954)
  - `metaPixel: ''`: on hold, as there's no Facebook Business account yet. Paste the digits-only Pixel ID when there is.
- `scripts/prerender.mjs` (`trackers()`) writes the tags into every built page, the 404 included. **Never add tracking snippets to `index.html`**, or dev visits would show up in the reports.
- `src/analytics.jsx` (mounted once in `App.jsx`) holds the client-side events. Every call is `window.gtag?.()` / `window.fbq?.()`, so it does nothing in dev or when an ID is empty.

## Events
| Event | When | Parameters |
|---|---|---|
| `page_view` | every page, including in-app navigation (GA4 enhanced measurement; the Pixel gets `PageView` from `analytics.jsx`) | `site_theme` |
| `generate_lead` (Meta: `Contact`) | tap on a `tel:`, WhatsApp or `mailto:` link | `method`: phone / whatsapp / email |
| `brochure_download` (Meta: `BrochureDownload`) | click on any `.pdf` link | `edition`: dark / light, `button_location`: header / footer / page, `file_name` |
| `theme_change` | visitor flips the theme toggle | `site_theme` |

- `site_theme` is set with `gtag('set')` before `config`, read from `<html data-theme>` (which the inline script in `index.html` sets first). Every event therefore carries the visitor's theme.
- Events are detected by URL from one delegated click listener, so new phone, WhatsApp or PDF links are tracked automatically. Don't add `onClick` tracking to individual buttons.
- A new event must use GA4's recommended names where one fits (`generate_lead`, `file_download`, `sign_up`), and needs a row in the table above.

## GA4 admin (done by the user, not in code)
- Key events: `generate_lead`, `brochure_download`.
- Event-scoped custom dimensions: `button_location`, `edition`, `site_theme`, `method`. Without them the parameters don't appear in reports.
- Reports: Engagement → Pages and screens (most visited), Engagement → Events, Acquisition → Traffic acquisition, Realtime.

## Privacy
- `src/pages/Privacy.jsx` (`/privacy/`, linked from the footer bottom only, not the header nav) describes exactly what the site collects. **When tracking changes (a new event, a new tracker, the Meta Pixel switched on), update that page and its `UPDATED` date.** The Meta paragraph appears automatically once `metaPixel` is set.
- Most students are under 18. India's DPDP Act restricts tracking and behavioural monitoring of children, so don't add ad remarketing or audience building without the user deciding on consent first.
