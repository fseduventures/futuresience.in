// Builds the print brochure and exports into ./brochure:
//   1. A4 reading copy (12 pages, in order)
//   2. A3 landscape booklet imposition (6 sides = 3 sheets, duplex, fold & centre-staple)
//   3. brochure/illustrator/*.ai: one editable Illustrator file per A3 side
// It also copies the A4 PDF into public/downloads (the website's "Download Brochure" links)
// and renders the 1200×630 social share image to public/images/og-image.png.
// Usage: npm run brochure   (then `npm run build` for the website)
import { build, preview } from 'vite'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { imposition, sideName } from '../src/brochure/layout.js'

const root = path.resolve(import.meta.dirname, '..')
const configFile = path.join(root, 'vite.brochure.config.js')
const outDir = path.join(root, 'brochure')

const browser = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
].find((p) => fs.existsSync(p))
if (!browser) throw new Error('Microsoft Edge or Google Chrome is required to export PDFs.')

await build({ configFile, root, logLevel: 'warn' })
const server = await preview({ configFile, root })
const base = server.resolvedUrls.local[0]
fs.mkdirSync(outDir, { recursive: true })
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-brochure-'))

// Two editions with identical content: the original dark one in ./brochure, the light one in ./brochure/light
const editions = [
  { theme: '', dir: outDir, suffix: '' },
  { theme: 'light', dir: path.join(outDir, 'light'), suffix: '-Light' },
]
const jobs = [
  ['reading', 'futureScience-Brochure-A4-12pages'],
  ['booklet', 'futureScience-Brochure-A3-Booklet-12pg-PRINT'],
]
// superseded 8-page outputs
for (const old of ['futureScience-Brochure-A4-8pages.pdf', 'futureScience-Brochure-A3-Booklet-PRINT.pdf']) {
  try { fs.rmSync(path.join(outDir, old), { force: true }) } catch { console.log(`! could not remove old ${old} (open in a viewer?)`) }
}
// async spawn: the preview server lives in this process, so the event loop must stay free
const runBrowser = (args) => new Promise((resolve) => {
  spawn(browser, ['--headless=new', '--disable-gpu', '--no-first-run', `--user-data-dir=${profile}`, '--virtual-time-budget=15000', ...args], { stdio: 'ignore' }).on('exit', resolve)
})
const report = (target) => console.log(fs.existsSync(target) ? `✓ ${path.relative(root, target)}` : `✗ failed: ${target}`)

// Prints one URL to a file; a file locked by a viewer is reported and skipped
async function printTo(target, query) {
  try { fs.rmSync(target, { force: true }) } catch {
    console.log(`✗ ${path.relative(root, target)} is open in another program (e.g. a PDF viewer). Close it and run again.`)
    return
  }
  await runBrowser(['--no-pdf-header-footer', `--print-to-pdf=${target}`, `${base}brochure.html?${query}`])
  report(target)
}

for (const ed of editions) {
  const t = ed.theme ? `&theme=${ed.theme}` : ''
  fs.mkdirSync(ed.dir, { recursive: true })
  for (const [mode, name] of jobs) await printTo(path.join(ed.dir, `${name}${ed.suffix}.pdf`), `mode=${mode}${t}`)

  // Illustrator files: one PDF-compatible .ai per A3 side (Illustrator opens one page per .ai file).
  // Text is live (static TrueType fonts embedded), shapes are vectors, photos are placed images.
  const aiDir = path.join(ed.dir, 'illustrator')
  fs.mkdirSync(aiDir, { recursive: true })
  for (const [i, pair] of imposition().entries()) {
    await printTo(path.join(aiDir, `futureScience-Brochure-A3${ed.suffix}_${sideName(i, pair)}.ai`), `mode=booklet&side=${i + 1}${t}`)
  }
  // the light edition reuses the fonts and instructions shipped with the dark one
  if (ed.theme) fs.cpSync(path.join(outDir, 'illustrator', 'fonts'), path.join(aiDir, 'fonts'), { recursive: true })
  if (ed.theme) fs.copyFileSync(path.join(outDir, 'illustrator', 'README.txt'), path.join(aiDir, 'README.txt'))
}

// The website's "Download Brochure" links: the dark A4 edition, or the light one when the site is in light theme
const download = path.join(root, 'public', 'downloads', 'futureScience-Brochure-2027-29.pdf')
fs.mkdirSync(path.dirname(download), { recursive: true })
fs.copyFileSync(path.join(outDir, `${jobs[0][1]}.pdf`), download)
report(download)
const downloadLight = download.replace(/\.pdf$/, '-Light.pdf')
fs.copyFileSync(path.join(outDir, 'light', `${jobs[0][1]}-Light.pdf`), downloadLight)
report(downloadLight)

const og = path.join(root, 'public', 'images', 'og-image.png')
await runBrowser(['--hide-scrollbars', '--window-size=1200,630', `--screenshot=${og}`, `${base}brochure.html?mode=og`])
report(og)

await new Promise((r) => server.httpServer.close(r))
fs.rmSync(profile, { recursive: true, force: true })
