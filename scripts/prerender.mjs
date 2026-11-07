// Runs after `vite build`. Renders every route to static HTML so search engines and
// AI crawlers (which often don't run JavaScript) see the full content, then writes
// per-page meta + JSON-LD, sitemap.xml, robots.txt and llms.txt into dist/.
import { build } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { pages, keywords, canonical, schemasFor } from '../src/seo/meta.js'
import {
  SITE_URL, BROCHURE_URL, ACADEMIC_YEAR, brand, contact, branches, programs, batches, faqs, toppers, achievers, cet2022, tracks, mentors,
  neetTopper, alumniColleges, testimonials, analytics, cet2025,
} from '../src/data/site.js'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const ssrOut = path.join(root, 'dist-ssr')
const { version } = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))

await build({ root, logLevel: 'warn', build: { ssr: 'src/entry-server.jsx', outDir: ssrOut, emptyOutDir: true } })
const { render } = await import(pathToFileURL(path.join(ssrOut, 'entry-server.js')).href)

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c')

function head(route, { noindex = false } = {}) {
  const page = pages[route] || { title: 'Page not found | futureScience', description: pages['/'].description }
  const url = canonical(route)
  const image = `${SITE_URL}/images/og-image.png`
  return [
    ...preloads(route),
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<meta name="keywords" content="${esc(keywords)}" />`,
    `<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'}" />`,
    noindex ? '' : `<link rel="canonical" href="${url}" />`,
    `<meta name="author" content="${esc(brand.full)}" />`,
    `<meta name="version" content="${esc(version)}" />`,
    `<meta name="geo.region" content="IN-MH" />`,
    `<meta name="geo.placename" content="Kandivali West, Malad West, Mumbai" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(brand.full)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(`${brand.full}: JEE, NEET, MHT-CET & CUET coaching in Kandivali West & Malad West`)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<link rel="alternate" type="text/plain" title="LLM summary" href="/llms.txt" />`,
    ...(noindex ? [] : schemasFor(route).map((s) => `<script type="application/ld+json">${json(s)}</script>`)),
    ...trackers(),
  ].filter(Boolean).join('\n    ')
}

// Fetch what the first screen needs before the CSS asks for it (PageSpeed: LCP and layout shift).
// The two latin fonts: without them the hero text reflows when they arrive. On the homepage, the hero
// background too, in the same size the CSS picks (720px copy at 640px and below, see styles.css).
const fonts = fs.readdirSync(path.join(dist, 'assets')).filter((f) => /^(sora|inter)-latin-wght-normal-.*\.woff2$/.test(f))
function preloads(route) {
  const out = fonts.map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  if (route === '/') {
    out.push(
      `<link rel="preload" href="/images/gallery/batch-celebration-sm.jpg" as="image" media="(max-width: 640px)" fetchpriority="high" />`,
      `<link rel="preload" href="/images/gallery/batch-celebration.jpg" as="image" media="(min-width: 641px)" fetchpriority="high" />`,
    )
  }
  return out
}

// Only in the built pages, so local dev visits never pollute the reports.
// GA4 counts in-app page changes itself (enhanced measurement); src/analytics.jsx does it for the Pixel.
// site_theme comes from <html data-theme>, which index.html sets before this runs.
function trackers() {
  const out = []
  if (analytics.ga4) {
    out.push(
      // gtag.js costs ~1s of main thread on phones, so it loads on the first interaction or 5s after
      // the page has loaded. Calls made before then wait in dataLayer and are sent once it arrives.
      `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('set',{site_theme:document.documentElement.dataset.theme==='light'?'light':'dark'});gtag('config',${json(analytics.ga4)});`
        + `(function(){var done=0;function load(){if(done)return;done=1;var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id=${esc(analytics.ga4)}';document.head.appendChild(s)}`
        + `['pointerdown','keydown','scroll','touchstart','mousemove'].forEach(function(e){addEventListener(e,load,{once:true,passive:true})});addEventListener('load',function(){setTimeout(load,5000)})})();</script>`,
    )
  }
  if (analytics.metaPixel) {
    out.push(
      `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${json(analytics.metaPixel)});fbq('track','PageView');</script>`,
    )
  }
  return out
}

function page(route, opts) {
  return template
    .replace(/<!--seo-head-->[\s\S]*?<!--\/seo-head-->/, head(route, opts))
    .replace('<!--app-html-->', render(route))
}

const routes = Object.keys(pages)
for (const route of routes) {
  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, page(route))
}
fs.writeFileSync(path.join(dist, '404.html'), page('/404', { noindex: true }))

// ── sitemap.xml ──
const today = new Date().toISOString().slice(0, 10)
const priority = { '/': '1.0', '/courses': '0.9', '/results': '0.9', '/contact': '0.9', '/about': '0.7', '/directors': '0.8', '/privacy': '0.3' }
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${canonical(r)}</loc><lastmod>${today}</lastmod><changefreq>${r === '/' || r === '/courses' ? 'weekly' : 'monthly'}</changefreq><priority>${priority[r]}</priority></url>`).join('\n')}
  <url><loc>${SITE_URL}${BROCHURE_URL}</loc><lastmod>${today}</lastmod><priority>0.6</priority></url>
</urlset>
`)

// ── robots.txt: welcome both search engines and AI answer engines ──
const aiBots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot', 'CCBot', 'meta-externalagent', 'Amazonbot', 'DuckAssistBot']
fs.writeFileSync(path.join(dist, 'robots.txt'), `# futureScience Private Tutorials: all crawlers, including AI search assistants, are welcome.
User-agent: *
Allow: /

${aiBots.map((b) => `User-agent: ${b}\nAllow: /`).join('\n\n')}

Sitemap: ${SITE_URL}/sitemap.xml
`)

// ── llms.txt: a plain-text brief that AI assistants can quote accurately ──
const addr = (b) => `${b.street}, ${b.locality}, ${b.city}, ${b.region} ${b.postalCode}`
fs.writeFileSync(path.join(dist, 'llms.txt'), `# ${brand.full}

> ${brand.full} (${brand.legal}) is a science coaching institute in Mumbai for Class 11 and Class 12 students, preparing them for JEE Main, JEE Advanced, NEET-UG, MHT-CET and CUET-UG, with engineering, medical and pharmacy entrance coaching. Branches: Kandivali West and Malad West. Tagline: "${brand.tagline}".

## Key facts
- Classes: Std. XI and Std. XII Science (HSC, CBSE, ICSE/ISC and other boards), integrated with entrance-exam preparation.
- Exams coached: JEE Main, JEE Advanced, NEET-UG, MHT-CET (PCM and PCB), CUET-UG (science domain), pharmacy entrance (B.Pharm via MHT-CET).
- Admissions open for academic year ${ACADEMIC_YEAR}.
- Phone / WhatsApp: ${contact.phone}
- Email: ${contact.email}
- Website: ${SITE_URL}/

## Branches
${branches.map((b) => `- ${brand.name} ${b.name}: ${addr(b)} (serves ${b.nearby.join(', ')})`).join('\n')}

## Upcoming batches (${ACADEMIC_YEAR})
${batches.map((b) => `- ${b.course}: starts ${b.start}. ${b.for}. ${b.details}`).join('\n')}

## Coaching tracks
${tracks.map((t) => `- ${t.title} (${t.exams}): ${t.text}`).join('\n')}

## Courses
${programs.map((p) => `- [${p.title}](${SITE_URL}/courses/#${p.id}): ${p.sub}. ${p.summary} Audience: ${p.audience}. Duration: ${p.duration}.`).join('\n')}

## Results
${toppers.map((t) => `- ${t.name} (${t.stream}): ${t.score} percentile, MHT-CET 2024${t.badge ? `, ${t.badge}` : ''}. ${t.breakdown.map(([s, v]) => `${s} ${v}`).join(', ')}.`).join('\n')}
${achievers.map((a) => `- ${a.name} (${a.stream}): ${a.score} percentile, MHT-CET 2024.`).join('\n')}
${cet2025.students.map((t) => `- ${t.name} (${t.stream}): ${t.score.toFixed(2)} percentile, ${cet2025.exam}. ${t.breakdown.map(([s, v]) => `${s} ${v}`).join(', ')}.`).join('\n')}
- ${cet2022.name}: ${cet2022.score}, ${cet2022.exam}. ${cet2022.ranks.map(([r, w, c]) => `Rank ${r} ${w} (${c})`).join('; ')}.
- ${neetTopper.name}: ${neetTopper.marks}/${neetTopper.outOf} (${neetTopper.percentile} percentile), ${neetTopper.exam}. ${neetTopper.breakdown.map(([s, v]) => `${s} ${v}`).join(', ')}.

## Where alumni went
${alumniColleges.map((c) => `- ${c.name}: ${c.course}`).join('\n')}

## Directors
${mentors.map((m) => `- [${m.name}](${SITE_URL}/directors/#${m.id}): ${m.lead}`).join('\n')}

## Student testimonials
${testimonials.map((t) => `- ${t.name} (${t.meta}): "${t.quote}"`).join('\n')}

## Frequently asked questions
${faqs.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}

## Pages
- [Home](${SITE_URL}/)
- [Courses & batches](${SITE_URL}/courses/)
- [Results](${SITE_URL}/results/)
- [Directors](${SITE_URL}/directors/)
- [About](${SITE_URL}/about/)
- [Contact & branches](${SITE_URL}/contact/)
- [Privacy policy](${SITE_URL}/privacy/)
- [Brochure ${ACADEMIC_YEAR} (PDF)](${SITE_URL}${BROCHURE_URL})
`)

fs.rmSync(ssrOut, { recursive: true, force: true })
console.log(`✓ pre-rendered ${routes.length} pages + 404, sitemap.xml, robots.txt, llms.txt`)
