// Builds deck/futureScience-Website-Tour.pptx: a Prezi-style tour of the whole website for
// exporting as a video (PowerPoint: File > Export > Create a Video > "Use recorded timings").
//   1. deck-capture.mjs screenshots every section of every page of dist/ (run `npm run build` first)
//   2. The pages become tall columns on one canvas. Each slide is a "camera" position on it:
//      an overview of all pages, then zooming into a page and panning down its sections.
//   3. Every slide gets PowerPoint's Morph transition and an automatic advance time, so the
//      camera glides between positions and the show plays (and exports) by itself.
// Usage: npm run deck   (release.py runs it on every release)
import pptxgen from 'pptxgenjs'
import JSZip from 'jszip'
import QRCode from 'qrcode'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { capture } from './deck-capture.mjs'
import { brand, contact, branches, SITE_URL, ACADEMIC_YEAR } from '../src/data/site.js'

const root = path.resolve(import.meta.dirname, '..')
const outDir = path.join(root, 'deck')
const shots = path.join(outDir, 'shots')
const OUT = path.join(outDir, 'futureScience-Website-Tour.pptx')
const { version } = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))

// ── Timing (milliseconds). The video runs about 4–5 minutes with these. ──
const T = {
  titleHold: 3500, // the opening title
  overviewHold: 1600, // each bird's-eye view of all pages
  stopHold: 2600, // each stop on a page section
  endHold: 6000, // the closing slide
  zoom: 1800, // Morph between the overview and a page
  pan: 1200, // Morph between stops on the same page
}

// ── Look ──
const SW = 13.333 // 16:9 slide, inches
const SH = 7.5
const NAVY = '0B0C2E'
const LIME = '8DC63F'
const NEAR = 40 // inches beyond the slide edge that zoomed-in slides still carry
const HEAD = 'Sora'
const BODY = 'Inter'

const pages = fs.existsSync(path.join(shots, 'sections.json')) && process.argv.includes('--reuse-shots')
  ? JSON.parse(fs.readFileSync(path.join(shots, 'sections.json'), 'utf8'))
  : await capture({ theme: 'dark' })

// Canvas units: 1 = one page width (1280 CSS px). Each section keeps its real position on its page.
for (const p of pages) {
  for (const s of p.sections) Object.assign(s, { y: s.top / p.width, h: s.height / p.width })
  const last = p.sections.at(-1)
  p.height = last.y + last.h
}

// Overview: all pages side by side, each scaled to fit the height (short pages capped in width)
const OV = { top: 1.55, height: 5.4, maxW: 1.45, margin: 0.7 }
for (const p of pages) p.ovScale = Math.min(OV.height / p.height, OV.maxW)
const ovTotal = pages.reduce((n, p) => n + p.ovScale, 0)
const ovGap = Math.min(0.9, (SW - 2 * OV.margin - ovTotal) / (pages.length - 1))
let ovX = (SW - ovTotal - ovGap * (pages.length - 1)) / 2
for (const p of pages) { p.ovX = ovX; ovX += p.ovScale + ovGap }

// Stops on each page: one per section (tall sections get up to three, top to bottom).
// A section already shown on an earlier page (same heading) gets no stop of its own.
const seen = new Set()
for (const p of pages) {
  p.stops = []
  for (const s of p.sections) {
    const key = s.label.toLowerCase()
    if (key && seen.has(key)) continue
    if (key) seen.add(key)
    const top = s.y * SW
    const h = s.h * SW
    if (h <= SH * 1.15) { p.stops.push({ camY: top + (h - SH) / 2, label: s.label }); continue }
    const n = Math.min(3, Math.ceil((h - SH) / (SH * 0.8)) + 1)
    for (let j = 0; j < n; j++) p.stops.push({ camY: top + ((h - SH) * j) / (n - 1), label: s.label })
  }
}

const pptx = new pptxgen()
pptx.layout = 'LAYOUT_WIDE'
pptx.title = `${brand.full}: website tour`
pptx.author = brand.legal
const timings = [] // per slide: [transition duration, hold]
const logo = path.join(root, 'public', 'images', 'logo-tag.png')
const logoRatio = 701 / 193

function newSlide(dur, hold) {
  const slide = pptx.addSlide()
  slide.background = { color: NAVY }
  timings.push([dur, hold])
  return slide
}
// Logo on a white plate (the logo's dark lettering needs a light background); morphs between slides
function addLogo(slide, x, y, w) {
  const h = w / logoRatio
  const pad = w * 0.09
  slide.addShape(pptx.ShapeType.roundRect, { objectName: '!!logo-plate', x: x - pad, y: y - pad, w: w + 2 * pad, h: h + 2 * pad, rectRadius: 0.12, fill: { color: 'FFFFFF' }, line: { type: 'none' } })
  slide.addImage({ objectName: '!!logo', path: logo, x, y, w, h })
}
const tileName = (p, i) => `!!${p.slug}-${i}`

function addOverview(focus) {
  const slide = newSlide(T.zoom, T.overviewHold)
  addLogo(slide, 0.55, 0.42, 1.9)
  slide.addText(SITE_URL.replace('https://', ''), { objectName: '!!url', x: SW - 5.1, y: 0.42, w: 4.6, h: 0.5, align: 'right', fontFace: HEAD, fontSize: 18, bold: true, color: LIME })
  for (const p of pages) {
    const w = p.ovScale
    p.sections.forEach((s, i) => slide.addImage({ objectName: tileName(p, i), path: path.join(shots, s.file), x: p.ovX, y: OV.top + s.y * w, w, h: s.h * w }))
    slide.addText(p.name, { objectName: `!!label-${p.slug}`, x: p.ovX - 0.6, y: OV.top - 0.42, w: w + 1.2, h: 0.32, align: 'center', fontFace: BODY, fontSize: 11, bold: true, color: p === focus ? LIME : 'C9CBE3' })
  }
  if (focus) {
    const w = focus.ovScale
    slide.addShape(pptx.ShapeType.roundRect, { objectName: '!!focus', x: focus.ovX - 0.08, y: OV.top - 0.08, w: w + 0.16, h: focus.height * w + 0.16, rectRadius: 0.06, fill: { type: 'none' }, line: { color: LIME, width: 2.5 } })
  }
}

function addStop(p, stop, dur) {
  const slide = newSlide(dur, T.stopHold)
  // Only sections near the view: PowerPoint won't open a file with objects ~170in off the slide
  // (the long homepage, zoomed in), and far-away sections are invisible during the move anyway
  p.sections.forEach((s, i) => {
    const y = s.y * SW - stop.camY
    const h = s.h * SW
    if (y + h > -NEAR && y < SH + NEAR) slide.addImage({ objectName: tileName(p, i), path: path.join(shots, s.file), x: 0, y, w: SW, h })
  })
  // caption chip: page and section, bottom left
  const label = stop.label.length > 58 ? `${stop.label.slice(0, 56).replace(/[\s,:;&·-]+\S*$/, '')}…` : stop.label
  const text = label ? `${p.name.toUpperCase()}  ·  ${label}` : p.name.toUpperCase()
  const w = Math.min(SW - 1, 1.2 + text.length * 0.105)
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.45, y: SH - 0.95, w, h: 0.55, rectRadius: 0.27, fill: { color: NAVY, transparency: 8 }, line: { color: LIME, width: 1.25 } })
  slide.addText(text, { x: 0.45, y: SH - 0.95, w, h: 0.55, align: 'center', valign: 'middle', fontFace: BODY, fontSize: 13, bold: true, color: 'FFFFFF' })
}

// 1. Title
{
  const slide = newSlide(1000, T.titleHold)
  addLogo(slide, SW / 2 - 2.6, 1.35, 5.2)
  slide.addText(brand.tagline, { x: 0.5, y: 3.35, w: SW - 1, h: 0.9, align: 'center', fontFace: HEAD, fontSize: 40, bold: true, color: 'FFFFFF' })
  slide.addText(`Class 11 & 12 Science · JEE · NEET-UG · MHT-CET · CUET · Kandivali West & Malad West, Mumbai`, { x: 0.5, y: 4.3, w: SW - 1, h: 0.5, align: 'center', fontFace: BODY, fontSize: 16, color: 'C9CBE3' })
  slide.addText(SITE_URL.replace('https://', ''), { objectName: '!!url', x: SW / 2 - 2.3, y: 5.3, w: 4.6, h: 0.5, align: 'center', fontFace: HEAD, fontSize: 18, bold: true, color: LIME })
}
// 2. For each page: overview with that page highlighted, then its stops
for (const p of pages) {
  addOverview(p)
  p.stops.forEach((stop, j) => addStop(p, stop, j === 0 ? T.zoom : T.pan))
}
// 3. Overview of everything, then the closing slide
addOverview(null)
{
  const slide = newSlide(T.zoom, T.endHold)
  addLogo(slide, SW / 2 - 2.1, 0.75, 4.2)
  slide.addText(`Admissions ${ACADEMIC_YEAR} open`, { x: 0.5, y: 2.45, w: SW - 1, h: 0.8, align: 'center', fontFace: HEAD, fontSize: 34, bold: true, color: 'FFFFFF' })
  slide.addText(`Call / WhatsApp ${contact.phone}`, { x: 0.8, y: 3.55, w: 7.4, h: 0.55, fontFace: HEAD, fontSize: 22, bold: true, color: LIME })
  slide.addText(branches.map((b) => `${b.locality}: ${b.street}`).join('\n'), { x: 0.8, y: 4.2, w: 7.4, h: 1.0, fontFace: BODY, fontSize: 14, color: 'C9CBE3', valign: 'top' })
  slide.addText(SITE_URL.replace('https://', ''), { objectName: '!!url', x: 0.8, y: 5.4, w: 7.4, h: 0.55, fontFace: HEAD, fontSize: 20, bold: true, color: 'FFFFFF' })
  const qr = await QRCode.toDataURL(SITE_URL, { margin: 1, width: 600, color: { dark: '#0B0C2EFF', light: '#FFFFFFFF' } })
  slide.addImage({ data: qr, x: SW - 3.6, y: 3.45, w: 2.6, h: 2.6 })
  slide.addText('Scan to visit', { x: SW - 3.6, y: 6.1, w: 2.6, h: 0.4, align: 'center', fontFace: BODY, fontSize: 12, color: 'C9CBE3' })
}

// ── Write, then add what pptxgenjs can't: Morph transitions + timings, and one copy per image ──
const zip = await JSZip.loadAsync(await pptx.write({ outputType: 'nodebuffer' }))

const transition = (dur, hold) =>
  `<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">`
  + `<mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" Requires="p159">`
  + `<p:transition xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" spd="slow" p14:dur="${dur}" advTm="${hold}"><p159:morph option="byObject"/></p:transition>`
  + `</mc:Choice><mc:Fallback><p:transition spd="slow" advTm="${hold}"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>`
for (const [i, [dur, hold]] of timings.entries()) {
  const file = `ppt/slides/slide${i + 1}.xml`
  const xml = await zip.file(file).async('string')
  zip.file(file, xml.replace('</p:sld>', `${transition(dur, hold)}</p:sld>`))
}

// pptxgenjs stores an image once per slide; the overview slides repeat every screenshot,
// so point all slides at one copy of each image (the file is several times smaller)
const canonical = new Map()
const rename = new Map()
for (const name of Object.keys(zip.files).filter((n) => n.startsWith('ppt/media/') && !zip.files[n].dir)) {
  const hash = crypto.createHash('md5').update(await zip.file(name).async('nodebuffer')).digest('hex')
  if (canonical.has(hash)) { rename.set(path.posix.basename(name), canonical.get(hash)); zip.remove(name) } else canonical.set(hash, path.posix.basename(name))
}
for (const rels of Object.keys(zip.files).filter((n) => /^ppt\/slides\/_rels\/.*\.rels$/.test(n))) {
  let xml = await zip.file(rels).async('string')
  xml = xml.replace(/Target="\.\.\/media\/([^"]+)"/g, (m, f) => `Target="../media/${rename.get(f) || f}"`)
  zip.file(rels, xml)
}

fs.mkdirSync(outDir, { recursive: true })
try {
  fs.writeFileSync(OUT, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }))
} catch (e) {
  if (e.code === 'EBUSY') throw new Error(`${path.relative(root, OUT)} is open in PowerPoint. Close it and run again.`)
  throw e
}
const seconds = timings.reduce((n, [d, h]) => n + d + h, 0) / 1000
console.log(`✓ ${path.relative(root, OUT)}: ${timings.length} slides, about ${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s as a video, ${(fs.statSync(OUT).size / 1024 / 1024).toFixed(1)} MB`)
