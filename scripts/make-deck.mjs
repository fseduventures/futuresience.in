// Builds deck/futureScience-Presentation.pptx: a cinematic, photo-led presentation about futureScience,
// built from src/data/site.js (like the brochure), for exporting as a video
// (`npm run video`, or PowerPoint: File > Export > Create a Video > "Use Recorded Timings and Narrations").
//   - About 22 scenes, each a full-screen photo (darkened for legibility) with big type.
//   - Every scene is two slides joined by a long Morph: the photo slowly zooms and drifts (Ken Burns)
//     while the text settles. Scenes cross-dissolve; the logo badge and a progress bar carry through.
// Like the brochure, student results are shown without passing years (testimonials keep theirs).
// Usage: npm run deck   (release.py runs it on every release)
import pptxgen from 'pptxgenjs'
import JSZip from 'jszip'
import QRCode from 'qrcode'
import sharp from 'sharp'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import {
  brand, contact, branches, programs, batches, methodology, pillars, testimonials,
  toppers, achievers, cet2025, cet2022, neetTopper, alumniColleges, heroStats, celebrations, SITE_URL, ACADEMIC_YEAR,
} from '../src/data/site.js'

const root = path.resolve(import.meta.dirname, '..')
const outDir = path.join(root, 'deck')
const assetDir = path.join(outDir, 'assets')
const OUT = path.join(outDir, 'futureScience-Presentation.pptx')

// ── Timing (ms) ──
// Each scene is four slides: the new photo dissolves in → beat 1 flies the title in → beat 2 pops in
// the cards, portraits and figures → a long, slow drift (Ken Burns) for its reading time (word count).
const T = { dissolve: 1200, beat1: 900, beat2: 850, minRead: 5000, maxRead: 10000, perWord: 130, still: 700 }

// ── Look (matches the website and brochure) ──
const SW = 13.333
const SH = 7.5
const C = { navy: '0B0C2E', lime: '8DC63F', gold: 'F5B82E', white: 'FFFFFF', soft: 'D4D6EC', glass: '0B0C2E' }
// The brand fonts when installed (with a missing font PowerPoint can repeat words at line breaks)
const fontDirs = [path.join(process.env.WINDIR || 'C:/Windows', 'Fonts'), path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'Windows', 'Fonts')]
const installed = (name) => fontDirs.some((d) => fs.existsSync(d) && fs.readdirSync(d).some((f) => f.toLowerCase().startsWith(name.toLowerCase())))
const HEAD = installed('Sora') ? 'Sora' : 'Segoe UI'
const BODY = installed('Inter') ? 'Inter' : 'Segoe UI'
const M = 0.75 // margin, inches

const noYear = (s) => s.replace(/,?\s*\b20\d\d\b/g, '')
const clip = (s, n) => (s.length <= n ? s : `${s.slice(0, n).replace(/[\s,;:.·-]+\S*$/, '')}…`)
const pub = (src) => path.join(root, 'public', src)

// ── Images, prepared once: backgrounds are 16:9 with the darkening baked in; portraits are ringed circles ──
fs.rmSync(assetDir, { recursive: true, force: true })
fs.mkdirSync(assetDir, { recursive: true })
const out = (key, ext) => path.join(assetDir, `${crypto.createHash('md5').update(key).digest('hex').slice(0, 12)}.${ext}`)
const overlays = {
  // navy gradients that keep text legible: strongest where the text sits
  left: '<linearGradient id="g" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#0B0C2E" stop-opacity=".93"/><stop offset=".45" stop-color="#0B0C2E" stop-opacity=".78"/><stop offset="1" stop-color="#0B0C2E" stop-opacity=".18"/></linearGradient>',
  right: '<linearGradient id="g" x1="1" x2="0" y1="0" y2="0"><stop offset="0" stop-color="#0B0C2E" stop-opacity=".93"/><stop offset=".45" stop-color="#0B0C2E" stop-opacity=".78"/><stop offset="1" stop-color="#0B0C2E" stop-opacity=".18"/></linearGradient>',
  bottom: '<linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#0B0C2E" stop-opacity=".05"/><stop offset=".55" stop-color="#0B0C2E" stop-opacity=".2"/><stop offset="1" stop-color="#0B0C2E" stop-opacity=".9"/></linearGradient>',
  full: '<linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#0B0C2E" stop-opacity=".72"/><stop offset="1" stop-color="#0B0C2E" stop-opacity=".86"/></linearGradient>',
}
async function bg(src, overlay = 'left', { blur = 0 } = {}) {
  const file = out(`${src}|${overlay}|${blur}`, 'jpg')
  if (fs.existsSync(file)) return file
  const W = 1920; const H = 1080
  let img = sharp(pub(src)).rotate().resize(W, H, { fit: 'cover', position: 'attention' })
  if (blur) img = img.blur(blur)
  const svg = `<svg width="${W}" height="${H}"><defs>${overlays[overlay]}</defs><rect width="${W}" height="${H}" fill="url(#g)"/></svg>`
  await img.composite([{ input: Buffer.from(svg) }]).jpeg({ quality: 86, mozjpeg: true }).toFile(file)
  return file
}
// circular portrait with a lime ring, upscaled with a good filter (some source photos are small)
async function ring(src, inches) {
  const file = out(`ring|${src}|${inches}`, 'png')
  if (fs.existsSync(file)) return file
  const px = Math.round(inches * 220)
  const stroke = Math.max(6, Math.round(px * 0.035))
  const face = await sharp(pub(src)).rotate().resize(px, px, { fit: 'cover', position: 'north', kernel: 'lanczos3' }).sharpen({ sigma: 0.7 }).toBuffer()
  const mask = Buffer.from(`<svg width="${px}" height="${px}"><circle cx="${px / 2}" cy="${px / 2}" r="${px / 2 - stroke / 2}" fill="#fff"/></svg>`)
  const ringSvg = Buffer.from(`<svg width="${px}" height="${px}"><circle cx="${px / 2}" cy="${px / 2}" r="${px / 2 - stroke / 2}" fill="none" stroke="#8DC63F" stroke-width="${stroke}"/></svg>`)
  await sharp(face).composite([{ input: mask, blend: 'dest-in' }, { input: ringSvg }]).png().toFile(file)
  return file
}
async function tile(src, w, h) {
  const file = out(`tile|${src}|${w}x${h}`, 'jpg')
  if (!fs.existsSync(file)) {
    const W = Math.round(w * 160); const H = Math.round(h * 160)
    const svg = `<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset=".35" stop-color="#0B0C2E" stop-opacity="0"/><stop offset="1" stop-color="#0B0C2E" stop-opacity=".92"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/></svg>`
    await sharp(pub(src)).rotate().resize(W, H, { fit: 'cover', position: 'attention' }).composite([{ input: Buffer.from(svg) }]).jpeg({ quality: 84, mozjpeg: true }).toFile(file)
  }
  return file
}

// ── Scenes ──
// scene(bgFile, { zoom, side }) collects elements in slide inches. Each element can set `beat` (1: the
// title beat, 2: everything else) and `enter` ('left' | 'right' | 'up' | 'pop'); see `entrance()`.
const scenes = []
function scene(bgFile, { zoom = 'in', logo = true, side = 'left' } = {}) {
  const s = { bg: bgFile, zoom, logo, side, els: [], words: 0 }
  const add = (kind, key, o) => s.els.push({ kind, key, o })
  Object.assign(s, {
    text(key, text, o) {
      const str = Array.isArray(text) ? text.map((r) => r.text).join('') : text
      s.words += str.split(/\s+/).filter(Boolean).length
      add('text', key, { font: BODY, color: C.white, ...o, text })
    },
    rect(key, o) { add('rect', key, o) },
    img(key, file, o) { add('img', key, { ...o, file }) },
    eyebrow(text, x = M, y = 1.55, w = 8) { s.text('eyebrow', text.toUpperCase(), { x, y, w, h: 0.4, size: 13, bold: true, color: C.lime, charSpacing: 3 }) },
    head(plain, hl, o = {}) { s.text('head', [{ text: plain, color: C.white }, { text: hl, color: C.lime }], { x: M, y: 2.0, w: 7.4, h: 2.0, size: 44, bold: true, font: HEAD, lineSpacing: 1.0, ...o }) },
    body(text, o = {}) { s.text('body', text, { x: M, y: 4.2, w: 6.6, h: 2.0, size: 17, color: C.soft, lineSpacing: 1.35, ...o }) },
  })
  scenes.push(s)
  return s
}
const glass = (s, key, x, y, w, h) => s.rect(key, { x, y, w, h, fill: C.glass, transparency: 30, line: C.lime, lineW: 1, radius: 0.16 })
const chip = (s, key, text, x, y, w, color = C.lime) => {
  s.rect(`${key}-bg`, { x, y, w, h: 0.42, fill: color, radius: 0.21 })
  s.text(key, text, { x, y, w, h: 0.42, size: 12, bold: true, color: C.navy, align: 'center', valign: 'middle' })
}
const pct = (n) => [{ text: n.toFixed(2), color: C.lime }, { text: ' %ile', color: C.soft }]

// 1. Opening
{
  const s = scene(await bg('/images/gallery/batch-celebration.jpg', 'full'), { zoom: 'out', logo: false })
  s.text('tag', brand.tagline, { x: M, y: 3.55, w: SW - 2 * M, h: 1.0, size: 54, bold: true, font: HEAD, align: 'center' })
  s.text('sub', 'Class 11 & 12 Science  ·  JEE  ·  NEET-UG  ·  MHT-CET  ·  CUET', { x: M, y: 4.65, w: SW - 2 * M, h: 0.5, size: 18, bold: true, color: C.lime, align: 'center' })
  s.text('place', 'Kandivali West & Malad West, Mumbai', { x: M, y: 5.2, w: SW - 2 * M, h: 0.45, size: 16, color: C.soft, align: 'center' })
  s.bigLogo = true
}
// 2. Hook
{
  const s = scene(await bg('/images/hero-cosmos.jpg', 'left'))
  s.eyebrow(brand.full)
  s.head('Where curious minds become ', 'top rankers.', { size: 50, h: 2.3 })
  s.body('Deep concepts, disciplined systems and mentors who are there for every doubt, from the first lecture to exam day.', { y: 4.45 })
}
// 3. About
{
  const s = scene(await bg('/images/gallery/lecture.jpg', 'left'), { zoom: 'out' })
  s.eyebrow('About futureScience')
  s.head('A launchpad for science careers, ', 'built for the top 1%.')
  s.body(`${brand.parent.replace(/^an/, 'An')}, with branches in Kandivali West and Malad West. We teach science the way scientists think: concepts taken to the core, doubts cleared the same day.`)
}
// 4. The numbers
{
  const s = scene(await bg('/images/gallery/results-day.jpg', 'full'))
  s.eyebrow('In numbers', M, 1.5, SW - 2 * M)
  s.text('head', [{ text: 'Results that speak ', color: C.white }, { text: 'louder than claims.', color: C.lime }], { x: M, y: 1.95, w: SW - 2 * M, h: 1.0, size: 40, bold: true, font: HEAD })
  heroStats.forEach((st, i) => {
    const x = M + i * 3.0
    glass(s, `card${i}`, x, 3.45, 2.8, 2.5)
    s.text(`v${i}`, `${st.prefix || ''}${st.decimals ? st.value.toFixed(st.decimals) : st.value}${st.suffix || ''}`, { x: x + 0.15, y: 3.75, w: 2.5, h: 0.9, size: 34, bold: true, font: HEAD, color: C.lime, align: 'center' })
    s.text(`l${i}`, noYear(st.label), { x: x + 0.2, y: 4.75, w: 2.4, h: 0.9, size: 14, color: C.soft, align: 'center' })
  })
}
// 5. Topper spotlight: Lyra
{
  const t = toppers[0]
  const s = scene(await bg('/images/gallery/felicitation.jpg', 'full', { blur: 14 }))
  s.img('photo', await ring(t.photo, 3.6), { x: SW - M - 3.6, y: 1.75, w: 3.6, h: 3.6 })
  s.eyebrow(`Topper spotlight · ${t.stream} · MHT-CET`, M, 1.6)
  s.text('name', t.name, { x: M, y: 2.05, w: 7.5, h: 0.9, size: 40, bold: true, font: HEAD })
  s.text('score', pct(t.score), { x: M, y: 2.9, w: 7.5, h: 1.5, size: 92, bold: true, font: HEAD })
  chip(s, 'badge', t.badge, M, 4.55, 3.6, C.gold)
  t.breakdown.forEach(([sub, v], j) => s.text(`b${j}`, [{ text: `${sub}  `, color: C.soft }, { text: v, color: C.white }], { x: M + j * 2.4, y: 5.3, w: 2.3, h: 0.5, size: 18, bold: true }))
}
// 6. More toppers: the best PCB and PCM of 2025 and the 2024 PCM topper
{
  const lead2025 = ['PCB', 'PCM'].map((st) => cet2025.students.find((t) => t.stream === st))
  const trio = [lead2025[0], toppers[1], lead2025[1]]
  const s = scene(await bg('/images/gallery/batch-celebration.jpg', 'full', { blur: 16 }), { zoom: 'out' })
  s.eyebrow('Toppers who set the bar', M, 1.45, SW - 2 * M)
  for (const [i, t] of trio.entries()) {
    const cx = M + 1.95 + i * 3.95
    s.img(`p${i}`, await ring(t.photo, 2.4), { x: cx - 1.2, y: 1.95, w: 2.4, h: 2.4 })
    s.text(`n${i}`, t.name, { x: cx - 1.9, y: 4.45, w: 3.8, h: 0.55, size: 22, bold: true, font: HEAD, align: 'center' })
    s.text(`s${i}`, pct(t.score), { x: cx - 1.9, y: 4.98, w: 3.8, h: 0.8, size: 38, bold: true, font: HEAD, align: 'center' })
    chip(s, `c${i}`, `${t.stream} · MHT-CET`, cx - 0.95, 5.85, 1.9)
  }
}
// 7. The merit list
{
  const featured = new Set([toppers[0].name, toppers[1].name, ...['PCB', 'PCM'].map((st) => cet2025.students.find((t) => t.stream === st).name)])
  const rest = [...achievers, ...cet2025.students].filter((a) => !featured.has(a.name)).sort((a, b) => b.score - a.score).slice(0, 10)
  const s = scene(await bg('/images/gallery/class-test.jpg', 'full', { blur: 12 }))
  s.eyebrow('And the merit list keeps growing', M, 1.4, SW - 2 * M)
  for (const [i, a] of rest.entries()) {
    const x = M + 0.35 + (i % 5) * 2.4
    const y = 2.0 + Math.floor(i / 5) * 2.55
    s.img(`p${i}`, await ring(a.photo, 1.25), { x: x + 0.4, y, w: 1.25, h: 1.25 })
    s.text(`s${i}`, pct(a.score), { x: x - 0.2, y: y + 1.3, w: 2.45, h: 0.5, size: 19, bold: true, font: HEAD, align: 'center' })
    s.text(`n${i}`, `${a.name} · ${a.stream}`, { x: x - 0.2, y: y + 1.78, w: 2.45, h: 0.4, size: 11.5, color: C.soft, align: 'center' })
  }
}
// 8. Legacy
{
  const s = scene(await bg('/images/gallery/results-day.jpg', 'full', { blur: 14 }), { zoom: 'out' })
  s.eyebrow('Then & now', M, 1.4, SW - 2 * M)
  s.text('head', [{ text: 'A legacy written in ', color: C.white }, { text: 'ranks, white coats and IIT IDs.', color: C.lime }], { x: M, y: 1.8, w: SW - 2 * M, h: 0.9, size: 34, bold: true, font: HEAD })
  const cards = [
    { p: cet2022.photo, exam: noYear(cet2022.exam), name: cet2022.name, big: cet2022.score, lines: cet2022.ranks.map(([r, w, c]) => `#${r}  ${w} · ${c}`) },
    { p: neetTopper.photo, exam: noYear(neetTopper.exam), name: neetTopper.name, big: `${neetTopper.marks}/${neetTopper.outOf} · ${neetTopper.percentile} %ile`, lines: neetTopper.breakdown.map(([sub, v]) => `${sub}  ${v} percentile`) },
  ]
  for (const [i, c] of cards.entries()) {
    const x = M + i * 6.0
    glass(s, `g${i}`, x, 2.95, 5.8, 3.85)
    s.img(`p${i}`, await ring(c.p, 1.6), { x: x + 0.3, y: 3.2, w: 1.6, h: 1.6 })
    s.text(`e${i}`, c.exam.toUpperCase(), { x: x + 2.15, y: 3.3, w: 3.5, h: 0.35, size: 12, bold: true, color: C.lime, charSpacing: 2 })
    s.text(`n${i}`, c.name, { x: x + 2.15, y: 3.65, w: 3.5, h: 0.6, size: 26, bold: true, font: HEAD })
    s.text(`b${i}`, c.big, { x: x + 2.15, y: 4.25, w: 3.5, h: 0.5, size: 18, bold: true, color: C.gold })
    s.text(`l${i}`, c.lines.join('\n'), { x: x + 0.35, y: 5.05, w: 5.2, h: 1.6, size: 13.5, color: C.soft, lineSpacing: 1.3 })
  }
}
// Directors: left out for now (their scenes can come back from git history)
// 12. Method
{
  // (ladder.jpg has text baked into it, so a plain photo here)
  const s = scene(await bg('/images/learner.jpg', 'left', { blur: 4 }))
  s.eyebrow('The fS method', M, 1.2)
  s.text('head', [{ text: 'Five steps from ', color: C.white }, { text: 'curiosity to success.', color: C.lime }], { x: M, y: 1.6, w: 11, h: 0.9, size: 36, bold: true, font: HEAD })
  methodology.forEach((st, i) => {
    const y = 2.75 + i * 0.86
    s.text(`n${i}`, st.n, { x: M, y, w: 0.9, h: 0.75, size: 30, bold: true, font: HEAD, color: C.lime })
    s.text(`t${i}`, st.title, { x: M + 1.0, y: y + 0.02, w: 6.6, h: 0.38, size: 17, bold: true, font: HEAD })
    s.text(`d${i}`, clip(st.text, 92), { x: M + 1.0, y: y + 0.38, w: 6.8, h: 0.4, size: 12, color: C.soft })
  })
}
// 13. The fS Advantage
{
  const s = scene(await bg('/images/gallery/class-test.jpg', 'full'), { zoom: 'out' })
  s.eyebrow('Why parents choose futureScience', M, 1.35, SW - 2 * M)
  s.text('head', [{ text: 'The fS ', color: C.white }, { text: 'Advantage.', color: C.lime }], { x: M, y: 1.75, w: SW - 2 * M, h: 0.9, size: 40, bold: true, font: HEAD })
  pillars.forEach((p, i) => {
    const x = M + (i % 3) * 4.0
    const y = 2.95 + Math.floor(i / 3) * 1.95
    glass(s, `g${i}`, x, y, 3.8, 1.75)
    s.text(`t${i}`, p.title, { x: x + 0.25, y: y + 0.2, w: 3.3, h: 0.45, size: 17, bold: true, font: HEAD, color: C.lime })
    s.text(`d${i}`, clip(p.text, 95), { x: x + 0.25, y: y + 0.7, w: 3.3, h: 0.95, size: 12.5, color: C.soft })
  })
}
// 14. Courses: one photo tile per programme
{
  const s = scene(await bg('/images/hero-cosmos.jpg', 'full', { blur: 10 }))
  s.eyebrow(`Programmes ${ACADEMIC_YEAR}`, M, 1.3, SW - 2 * M)
  s.text('head', [{ text: 'Courses crafted for ', color: C.white }, { text: 'every ambition.', color: C.lime }], { x: M, y: 1.7, w: SW - 2 * M, h: 0.9, size: 38, bold: true, font: HEAD })
  for (const [i, p] of programs.entries()) {
    const w = 2.83; const h = 2.0
    const x = M + (i % 4) * (w + 0.12)
    const y = 2.85 + Math.floor(i / 4) * (h + 0.15)
    s.img(`i${i}`, await tile(p.image, w, h), { x, y, w, h })
    s.text(`t${i}`, p.title, { x: x + 0.15, y: y + h - 0.78, w: w - 0.3, h: 0.4, size: 14, bold: true, font: HEAD })
    s.text(`s${i}`, clip(p.sub, 44), { x: x + 0.15, y: y + h - 0.4, w: w - 0.3, h: 0.32, size: 10, color: C.lime })
  }
}
// 15. Admissions
{
  const s = scene(await bg('/images/astronaut.jpg', 'left'), { zoom: 'out' })
  s.eyebrow(`Upcoming batches · ${ACADEMIC_YEAR}`, M, 1.4)
  s.head('Admissions ', 'now open.', { y: 1.8, w: 10, h: 1.0, size: 48 })
  batches.forEach((b, i) => {
    const y = 3.05 + i * 1.3
    glass(s, `g${i}`, M, y, 7.6, 1.12)
    s.rect(`d${i}`, { x: M + 0.12, y: y + 0.12, w: 2.2, h: 0.88, fill: C.lime, radius: 0.12 })
    s.text(`dl${i}`, 'COMMENCES', { x: M + 0.3, y: y + 0.17, w: 2.0, h: 0.3, size: 10, bold: true, color: C.navy })
    s.text(`dd${i}`, b.start, { x: M + 0.3, y: y + 0.45, w: 2.0, h: 0.45, size: 17, bold: true, font: HEAD, color: C.navy })
    s.text(`c${i}`, b.course, { x: M + 2.55, y: y + 0.17, w: 4.9, h: 0.45, size: 18, bold: true, font: HEAD })
    s.text(`f${i}`, b.for, { x: M + 2.55, y: y + 0.6, w: 4.9, h: 0.35, size: 12, color: C.soft })
  })
}
// 16–17. Two student voices (they keep their years, as in the brochure)
for (const [i, t] of testimonials.filter((x) => x.photo).slice(0, 2).entries()) {
  const s = scene(await bg(i === 0 ? '/images/gallery/lecture-mono.jpg' : '/images/gallery/christmas.jpg', 'full', { blur: 12 }), { zoom: i ? 'out' : 'in' })
  s.text('q', '“', { x: M, y: 0.95, w: 1.5, h: 1.4, size: 120, bold: true, font: HEAD, color: C.lime })
  s.text('quote', clip(t.quote, 260), { x: M + 0.2, y: 2.25, w: SW - 2 * M - 0.4, h: 2.6, size: 24, font: HEAD, lineSpacing: 1.25 })
  s.img('p', await ring(t.photo, 1.2), { x: M + 0.2, y: 5.25, w: 1.2, h: 1.2 })
  s.text('n', t.name, { x: M + 1.65, y: 5.35, w: 8, h: 0.5, size: 20, bold: true, font: HEAD })
  s.text('m', t.meta, { x: M + 1.65, y: 5.85, w: 9, h: 0.45, size: 13, color: C.soft })
}
// 18. Alumni
{
  const s = scene(await bg('/images/education.jpg', 'right'), { side: 'right' })
  const x = SW - M - 7.6
  s.text('eyebrow', 'WHERE OUR ALUMNI WENT', { x, y: 1.3, w: 7.6, h: 0.4, size: 13, bold: true, color: C.lime, charSpacing: 3 })
  s.text('head', [{ text: 'Doctors, engineers & researchers, ', color: C.white }, { text: 'shaped here.', color: C.lime }], { x, y: 1.7, w: 7.6, h: 1.3, size: 32, bold: true, font: HEAD })
  alumniColleges.forEach((c, i) => {
    const cx = x + (i % 2) * 3.85
    const y = 3.15 + Math.floor(i / 2) * 0.72
    s.rect(`dot${i}`, { x: cx, y: y + 0.12, w: 0.16, h: 0.16, fill: C.lime, radius: 0.08 })
    s.text(`c${i}`, clip(c.name, 38), { x: cx + 0.3, y, w: 3.5, h: 0.38, size: 13.5, bold: true })
    s.text(`k${i}`, clip(c.course, 40), { x: cx + 0.3, y: y + 0.33, w: 3.5, h: 0.3, size: 10, color: C.soft })
  })
}
// 19–21. Life at futureScience: the latest festival album, full screen
{
  const album = celebrations[0]
  const picks = album.photos.filter((p) => !p.tall).slice(0, 3)
  for (const [i, p] of picks.entries()) {
    const s = scene(await bg(p.src, 'bottom'), { zoom: i % 2 ? 'out' : 'in' })
    if (i === 0) {
      s.text('eyebrow', 'LIFE AT FUTURESCIENCE', { x: M, y: SH - 2.35, w: 8, h: 0.4, size: 13, bold: true, color: C.lime, charSpacing: 3 })
      s.text('head', [{ text: 'Where hard work ', color: C.white }, { text: 'meets celebration.', color: C.lime }], { x: M, y: SH - 1.95, w: SW - 2 * M, h: 0.85, size: 36, bold: true, font: HEAD })
    }
    s.text('cap', `${album.title}  ·  ${p.caption}`, { x: M, y: SH - 1.0, w: SW - 2 * M, h: 0.45, size: 16, bold: true, color: i === 0 ? C.soft : C.white })
  }
}
// 22. Call to action
{
  const s = scene(await bg('/images/gallery/batch-celebration.jpg', 'left'), { zoom: 'out', logo: false })
  s.bigLogo = 'end'
  s.text('head', [{ text: 'Book your free ', color: C.white }, { text: 'counselling session.', color: C.lime }], { x: M, y: 2.3, w: 8.0, h: 1.3, size: 34, bold: true, font: HEAD })
  const rows = [['Call / WhatsApp', contact.phone], ['Website', SITE_URL.replace('https://', '')], ...branches.map((b) => [b.locality, `${b.street}, ${b.city} ${b.postalCode}`])]
  rows.forEach(([k, v], i) => {
    const y = 3.95 + i * 0.66
    s.text(`k${i}`, k.toUpperCase(), { x: M, y, w: 7, h: 0.28, size: 10.5, bold: true, color: C.lime, charSpacing: 2 })
    s.text(`v${i}`, v, { x: M, y: y + 0.26, w: 7.6, h: 0.42, size: 18, bold: true, font: HEAD })
  })
  const qr = path.join(assetDir, 'qr.png')
  await QRCode.toFile(qr, SITE_URL, { margin: 1, width: 700, color: { dark: '#0B0C2EFF', light: '#FFFFFFFF' } })
  s.rect('qrbg', { x: SW - M - 3.1, y: 3.0, w: 3.1, h: 3.45, fill: C.white, radius: 0.2 })
  s.img('qr', qr, { x: SW - M - 2.9, y: 3.2, w: 2.7, h: 2.7 })
  s.text('scan', 'Scan to visit', { x: SW - M - 3.1, y: 5.9, w: 3.1, h: 0.4, size: 13, bold: true, color: C.navy, align: 'center' })
}

// ── Slides: four per scene (dissolve → beat 1 → beat 2 → slow drift) ──
const pptx = new pptxgen()
pptx.layout = 'LAYOUT_WIDE'
pptx.title = `${brand.full}: presentation`
pptx.author = brand.legal
const timings = []
// Animated logo (IIT-Medical Academy ⇄ Private Tutorials), made by scripts/make-logo-gif.py. PowerPoint restarts
// a GIF on every slide, so this one starts and ends on the finished Academy logo and a restart can't be seen.
const logoFile = path.join(root, 'scripts', 'logo-src', 'logo-academy-deck.gif')
const logoRatio = 1000 / 256
const readTime = (s) => Math.round(Math.min(T.maxRead, Math.max(T.minRead, 3000 + s.words * T.perWord)))

// Who comes in when, and how. Titles fly in from the text's side on beat 1 (centred ones pop);
// paragraphs and quotes sweep up from below and everything else pops from its centre on beat 2.
const TITLE = /^(eyebrow|head|name|score|tag|sub|place|q|role)$/
function entrance(s, e) {
  const o = e.o
  const beat = o.beat ?? (e.kind === 'text' && TITLE.test(e.key) ? 1 : 2)
  const enter = o.enter ?? (beat === 1 ? (o.align === 'center' || e.key === 'q' ? 'pop' : s.side) : /^(body|quote|lead)$/.test(e.key) ? 'up' : 'pop')
  return { beat, enter }
}
// geometry before the element has entered: off-slide, or shrunk to 5% around its centre
function hidden(o, enter) {
  if (enter === 'left') return { x: -o.w - 0.3, y: o.y, w: o.w, h: o.h, k: 1 }
  if (enter === 'right') return { x: SW + 0.3, y: o.y, w: o.w, h: o.h, k: 1 }
  if (enter === 'up') return { x: o.x, y: SH + 0.3, w: o.w, h: o.h, k: 1 }
  const k = 0.05 // and fully transparent, so it fades up as it grows (no specks before it enters)
  return { x: o.x + (o.w * (1 - k)) / 2, y: o.y + (o.h * (1 - k)) / 2, w: o.w * k, h: o.h * k, k, clear: true }
}

function logo(slide, mode, pop = false) {
  // big and centred on the opening and closing scenes, a small badge in the corner everywhere else
  let [w, x, y] = mode === true ? [5.6, SW / 2 - 2.8, 1.05] : mode === 'end' ? [3.8, M + 0.1, 0.75] : [1.9, M, 0.42]
  if (pop) { x += w * 0.475; y += w / logoRatio * 0.475; w *= 0.05 } // the opening logo pops in
  const h = w / logoRatio
  const pad = w * 0.07
  slide.addShape(pptx.ShapeType.roundRect, { objectName: '!!logo-plate', x: x - pad, y: y - pad, w: w + 2 * pad, h: h + 2 * pad, rectRadius: 0.12 * (w / 5.6), fill: { color: C.white, transparency: pop ? 100 : 0 }, line: { type: 'none' } })
  slide.addImage({ objectName: '!!logo', path: logoFile, x, y, w, h, ...(pop ? { transparency: 100 } : {}) })
}

const PHASES = [
  { shown: 0, drift: 0 }, // the new photo dissolves in on its own
  { shown: 1, drift: 0.07 }, // beat 1
  { shown: 2, drift: 0.14 }, // beat 2
  { shown: 2, drift: 1 }, // the slow drift while it's read
]
scenes.forEach((s, si) => {
  const read = readTime(s)
  PHASES.forEach((ph, pi) => {
    const slide = pptx.addSlide()
    slide.background = { color: C.navy }
    // Ken Burns: zoom in (1.0 → 1.1) or out (1.1 → 1.0), drifting sideways a little
    const z = s.zoom === 'in' ? 1 + 0.1 * ph.drift : 1.1 - 0.1 * ph.drift
    const dx = (si % 2 ? -0.3 : 0.3) * ph.drift
    slide.addImage({ objectName: `!!s${si}-bg`, path: s.bg, x: (SW - SW * z) / 2 + dx, y: (SH - SH * z) / 2, w: SW * z, h: SH * z })
    for (const e of s.els) {
      const o = e.o
      const { beat, enter } = entrance(s, e)
      const g = beat <= ph.shown ? { x: o.x, y: o.y, w: o.w, h: o.h, k: 1 } : hidden(o, enter)
      const geo = { objectName: `!!s${si}-${e.key}`, x: g.x, y: g.y, w: g.w, h: g.h }
      if (e.kind === 'rect') {
        slide.addShape(o.radius ? pptx.ShapeType.roundRect : pptx.ShapeType.rect, {
          ...geo, rectRadius: (o.radius || 0) * g.k, fill: { color: o.fill, transparency: g.clear ? 100 : o.transparency || 0 },
          line: o.line && !g.clear ? { color: o.line, width: Math.max(0.25, (o.lineW || 1) * g.k) } : { type: 'none' },
        })
      } else if (e.kind === 'img') {
        slide.addImage({ ...geo, path: o.file, ...(g.clear ? { transparency: 100 } : {}) })
      } else {
        const runs = Array.isArray(o.text) ? o.text.map((r) => ({ text: r.text, options: { color: r.color } })) : o.text
        slide.addText(runs, {
          ...geo, fontFace: o.font, fontSize: Math.max(1, o.size * g.k), color: o.color, bold: !!o.bold, italic: !!o.italic, ...(g.clear ? { transparency: 100 } : {}),
          align: o.align || 'left', valign: o.valign || 'top', margin: 0, lineSpacingMultiple: o.lineSpacing || 1.12,
          ...(o.charSpacing ? { charSpacing: o.charSpacing * g.k } : {}),
        })
      }
    }
    if (s.bigLogo) logo(slide, s.bigLogo, si === 0 && pi === 0)
    else if (s.logo) logo(slide, false)
    // progress bar: grows through the film
    slide.addShape(pptx.ShapeType.rect, { objectName: '!!progress', x: 0, y: SH - 0.07, w: Math.max(0.01, (SW * (si + ph.drift)) / scenes.length), h: 0.07, fill: { color: C.lime }, line: { type: 'none' } })
    timings.push([
      [si === 0 ? 800 : T.dissolve, 50],
      [T.beat1, 80],
      [T.beat2, 80],
      [read, T.still],
    ][pi])
  })
})

// ── Add Morph + auto-advance (pptxgenjs can't), and keep one copy of each image ──
const zip = await JSZip.loadAsync(await pptx.write({ outputType: 'nodebuffer' }))
const transition = (dur, hold) =>
  `<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">`
  + `<mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" Requires="p159">`
  + `<p:transition xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" spd="slow" p14:dur="${dur}" advTm="${hold}"><p159:morph option="byObject"/></p:transition>`
  + `</mc:Choice><mc:Fallback><p:transition spd="slow" advTm="${hold}"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>`
for (const [i, [dur, hold]] of timings.entries()) {
  const file = `ppt/slides/slide${i + 1}.xml`
  zip.file(file, (await zip.file(file).async('string')).replace('</p:sld>', `${transition(dur, hold)}</p:sld>`))
}
const canonical = new Map()
const rename = new Map()
for (const name of Object.keys(zip.files).filter((n) => n.startsWith('ppt/media/') && !zip.files[n].dir)) {
  const hash = crypto.createHash('md5').update(await zip.file(name).async('nodebuffer')).digest('hex')
  if (canonical.has(hash)) { rename.set(path.posix.basename(name), canonical.get(hash)); zip.remove(name) } else canonical.set(hash, path.posix.basename(name))
}
for (const rels of Object.keys(zip.files).filter((n) => /^ppt\/slides\/_rels\/.*\.rels$/.test(n))) {
  const xml = await zip.file(rels).async('string')
  zip.file(rels, xml.replace(/Target="\.\.\/media\/([^"]+)"/g, (m, f) => `Target="../media/${rename.get(f) || f}"`))
}

try {
  fs.writeFileSync(OUT, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }))
} catch (e) {
  if (e.code === 'EBUSY') throw new Error(`${path.relative(root, OUT)} is open in PowerPoint. Close it and run again.`)
  throw e
}
if (HEAD !== 'Sora' || BODY !== 'Inter') console.log('note: Sora/Inter are not installed, so the deck uses Segoe UI (install brochure/illustrator/fonts/*.ttf and run again for the brand fonts)')
const seconds = timings.reduce((n, [d, h]) => n + d + h, 0) / 1000
console.log(`✓ ${path.relative(root, OUT)}: ${scenes.length} scenes, ${timings.length} slides, about ${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s as a video, ${(fs.statSync(OUT).size / 1024 / 1024).toFixed(1)} MB`)
