// Checks the pre-rendered pages in ./dist for the on-page issues Seobility flags.
// Run after a build: npm run seo:check  (exits with code 1 when something needs fixing)
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const DIST = 'dist'
const LIMITS = { title: 60, description: 155, headings: 40 }

const decode = (s) => s
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
// img alt counts as link text, like search engines read it
const text = (html) => decode(html.replace(/<img[^>]*\balt="([^"]*)"[^>]*>/g, ' $1 ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
const words = (s) => s.toLowerCase().match(/[a-z0-9][a-z0-9.%-]*[a-z0-9%]|[a-z0-9]/g) || []

function pages(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) return pages(p)
    return name === 'index.html' ? [p] : []
  })
}

let total = 0
for (const file of pages(DIST)) {
  const html = readFileSync(file, 'utf8')
  const body = html.slice(html.indexOf('<body'))
  const issues = []

  const title = text(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '')
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '')
  if (!title) issues.push('missing <title>')
  else if (title.length > LIMITS.title) issues.push(`title is ${title.length} chars (max ${LIMITS.title}): "${title}"`)
  if (!desc) issues.push('missing meta description')
  else if (desc.length > LIMITS.description) issues.push(`description is ${desc.length} chars (max ${LIMITS.description})`)

  const bodyWords = new Set(words(text(body)))
  const missing = words(title).filter((w) => w.length > 2 && !bodyWords.has(w))
  if (missing.length) issues.push(`title words not in page content: ${missing.join(', ')}`)

  const headings = [...body.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({ level: m[1], text: text(m[2]) }))
  const h1s = headings.filter((h) => h.level === '1').length
  if (h1s !== 1) issues.push(`${h1s} <h1> tags (need exactly 1)`)
  if (headings.length > LIMITS.headings) issues.push(`${headings.length} headings (keep under ${LIMITS.headings}; use .card-title for small card labels)`)
  const seen = new Map()
  for (const h of headings) seen.set(h.text.toLowerCase(), (seen.get(h.text.toLowerCase()) || 0) + 1)
  for (const [t, n] of seen) if (n > 1) issues.push(`duplicate heading ×${n}: "${t}"`)

  for (const m of body.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]+"/.test(m[0])) issues.push(`image without alt text: ${m[0].match(/src="([^"]*)"/)?.[1]}`)
  }

  const pageUrl = new URL(`/${relative(DIST, file).replace(/\\/g, '/').replace(/index\.html$/, '')}`, 'https://site.local')
  const anchors = new Map()
  for (const m of body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    // resolve "#x" and "/courses#x" to the same address before comparing
    const raw = decode(m[1].match(/href="([^"]*)"/)?.[1] ?? '')
    const href = new URL(raw, pageUrl).href.replace(/\/(#|$)/, '$1')
    const t = text(m[2])
    if (!t) { issues.push(`link without anchor text: ${href}`); continue }
    if (!anchors.has(t)) anchors.set(t, new Set())
    anchors.get(t).add(href)
  }
  for (const [t, hrefs] of anchors) {
    if (hrefs.size > 1) issues.push(`link text "${t}" points to ${hrefs.size} different URLs (add a .sr-only suffix)`)
  }

  const name = relative(DIST, file).replace(/\\/g, '/')
  console.log(issues.length ? `✗ ${name}` : `✓ ${name}`)
  for (const i of issues) console.log(`    - ${i}`)
  total += issues.length
}

console.log(total ? `\n${total} issue(s) found.` : '\nAll pages pass.')
process.exit(total ? 1 : 0)
