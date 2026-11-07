// Step 1 of `npm run deck`: screenshots every section of every page of the built site (dist/),
// as the website looks, into deck/shots/. Also writes deck/shots/sections.json (sizes + labels).
import { preview } from 'vite'
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const out = path.join(root, 'deck', 'shots')

export const PAGES = [
  { route: '/', name: 'Home' },
  { route: '/courses/', name: 'Courses' },
  { route: '/results/', name: 'Results' },
  { route: '/directors/', name: 'Directors' },
  { route: '/about/', name: 'About' },
  { route: '/life/', name: 'Life at futureScience' },
  { route: '/contact/', name: 'Contact' },
]
// 1280 CSS px at 1.5x = 1920px wide images: sharp in a 1080p video
const WIDTH = 1280
const SCALE = 1.5
const MIN_HEIGHT = 260 // thinner strips (CTA bands, spacers) aren't worth a stop of their own

const browserPath = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find((p) => fs.existsSync(p))

// Show every section in its final state: no fade-ins, no lazy rendering, animations at their end
const FREEZE = `
  main > section ~ section { content-visibility: visible !important; }
  .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
  .header { position: relative !important; } /* stays at the top of the page, not over every section */
`

export async function capture({ theme = 'dark' } = {}) {
  if (!fs.existsSync(path.join(root, 'dist', 'index.html'))) throw new Error('dist/ is missing: run `npm run build` first.')
  if (!browserPath) throw new Error('Google Chrome or Microsoft Edge is required.')
  fs.rmSync(out, { recursive: true, force: true })
  fs.mkdirSync(out, { recursive: true })

  const server = await preview({ root, logLevel: 'warn', preview: { port: 4190, strictPort: true } })
  const base = server.resolvedUrls.local[0].replace(/\/$/, '')
  const browser = await puppeteer.launch({ executablePath: browserPath, headless: true, args: ['--no-first-run', '--hide-scrollbars'] })
  const manifest = []
  try {
    for (const p of PAGES) {
      const page = await browser.newPage()
      await page.setViewport({ width: WIDTH, height: 800, deviceScaleFactor: SCALE })
      await page.evaluateOnNewDocument((t) => { try { localStorage.setItem('fs-theme', t) } catch {} }, theme)
      await page.goto(base + p.route, { waitUntil: 'networkidle0' })
      await page.addStyleTag({ content: FREEZE })
      // lazy images load on demand; for a capture, load them all now
      await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager' }))
      // walk down the page so lazy images load and counters run, then wait for them to settle
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)) }
        window.scrollTo(0, 0)
        // wait for images, but not forever: a lazy image that never started would hang the capture
        const loaded = Promise.all([...document.images].map((img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r }))))
        await Promise.race([loaded, new Promise((r) => setTimeout(r, 8000))])
        const track = document.querySelector('.spot-track')
        if (track) track.scrollLeft = 0
      })
      // hovering the Topper Spotlight pauses its auto-advance, so it stays on the first topper
      if (await page.$('.hero-card')) await page.hover('.hero-card')
      await page.evaluate(() => { const t = document.querySelector('.spot-track'); if (t) t.scrollLeft = 0 })
      await new Promise((r) => setTimeout(r, 2000))

      const sections = await page.evaluate((min) => {
        const label = (s) => {
          const t = s.querySelector('h1, h2')?.textContent || s.querySelector('.eyebrow, .card-title')?.textContent || ''
          return t.replace(/\s+/g, ' ').trim()
        }
        const list = [...document.querySelectorAll('main > section')].map((s) => {
          const r = s.getBoundingClientRect()
          return { top: r.top + window.scrollY, height: r.height, label: label(s) }
        })
        // the first stop includes the top bar and navigation, like a visitor sees it
        if (list.length) { list[0].height += list[0].top; list[0].top = 0 }
        return list.filter((s) => s.height >= min)
      }, MIN_HEIGHT)

      const slug = p.route === '/' ? 'home' : p.route.replace(/\//g, '')
      for (const [i, s] of sections.entries()) {
        const file = `${slug}-${String(i + 1).padStart(2, '0')}.jpg`
        // Size the window to the section and scroll to it: capturing far outside the window
        // (the long homepage is ~16,000px) hits Chrome's texture limit and comes out blank
        await page.setViewport({ width: WIDTH, height: Math.round(s.height), deviceScaleFactor: SCALE })
        await page.evaluate((y) => window.scrollTo(0, y), Math.round(s.top))
        await new Promise((r) => setTimeout(r, 250))
        await page.screenshot({ path: path.join(out, file), type: 'jpeg', quality: 82 })
        Object.assign(s, { file })
      }
      manifest.push({ ...p, slug, width: WIDTH, sections })
      console.log(`✓ ${p.name}: ${sections.length} sections`)
      await page.close()
    }
  } finally {
    await browser.close()
    await new Promise((r) => server.httpServer.close(r))
  }
  fs.writeFileSync(path.join(out, 'sections.json'), JSON.stringify(manifest, null, 2))
  return manifest
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) await capture()
