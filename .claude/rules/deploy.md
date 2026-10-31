# Deploy and off-site SEO

## Release checklist
1. `npm run release` (or `npm run build` if the brochure didn't change). Close any open brochure PDFs first, because Windows locks them.
2. `npm run seo:check` must print **All pages pass**.
3. Upload the **contents** of `dist/` into `public_html`, **including the hidden `.htaccess`**.
4. Re-run Seobility on https://www.futurescience.in/ (and any changed page) to confirm.

## Server (`public/.htaccess`)
- `AddDefaultCharset UTF-8` sends the charset in the HTTP header (a Seobility check).
- `ServerSignature Off` plus `Header unset Server` hide the server version. This works on LiteSpeed. On plain Apache the host must set `ServerTokens Prod` in the main config, and `.htaccess` can't do it.
- Response time (Seobility wants under 0.4s, it was 0.72s) depends on the hosting, not the code. Options: Cloudflare free plan in front of the site, LiteSpeed cache, or a faster host.
- Keep the HTTPS + `www.` redirect; it gives every page one canonical address.

## Off-site (the code can't fix these)
"External factors" scored 3% because only one domain links to the site. Work on backlinks:
- Google Business Profile for **each** branch (Kandivali West, Malad West) with the website link
- Listings on Justdial, Sulekha, UrbanPro and IndiaMART
- The website link in the Instagram / YouTube / Facebook bios (add the URLs to `contact.socials` in `site.js` too)
- Links from partner schools and junior colleges, and local news coverage of results
