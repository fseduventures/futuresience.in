// Builds deck/futureScience-Presentation.pptx: a Prezi-style presentation about futureScience,
// built from src/data/site.js (like the brochure), for exporting as a video
// (PowerPoint: File > Export > Create a Video > "Use Recorded Timings and Narrations").
//   - 15 designed frames (about, results, directors, method, courses, admissions, life, contact)
//     sit on one large canvas. Every slide is a camera position on that canvas.
//   - Each slide carries the whole canvas, every object named `!!…`, so PowerPoint's Morph
//     transition glides and zooms the camera between frames. Hold times are preset per frame.
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
  brand, contact, branches, programs, batches, methodology, pillars, mentors, mentorsIntro, testimonials,
  toppers, achievers, cet2025, cet2022, neetTopper, alumniColleges, heroStats, celebrations, gallery, SITE_URL, ACADEMIC_YEAR,
} from '../src/data/site.js'

const root = path.resolve(import.meta.dirname, '..')
const outDir = path.join(root, 'deck')
const assetDir = path.join(outDir, 'assets')
const OUT = path.join(outDir, 'futureScience-Presentation.pptx')

// ── Timing (ms). Each frame holds for a reading time based on its word count. ──
const T = { titleHold: 4000, overviewHold: 2600, endHold: 9000, minHold: 4500, maxHold: 10000, perWord: 140, glide: 1800, zoom: 2200 }

// ── Look (matches the brochure) ──
const SW = 13.333
const SH = 7.5
const C = { bg: '0B0C2E', navy: '14154A', navyCard: '1E2060', lime: '8DC63F', limeInk: '4A7A16', ink: '13144A', muted: '6B6E85', soft: 'C9CBE3', gold: 'F5B82E', white: 'FFFFFF', line: 'E3E6EF', tint: 'F4F6FB' }
// The brand fonts only when installed on this PC: with a missing font PowerPoint substitutes one and
// can repeat words at line breaks. Segoe UI ships with every Windows PC. (Fonts: brochure/illustrator/fonts)
const fontDirs = [path.join(process.env.WINDIR || 'C:/Windows', 'Fonts'), path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'Windows', 'Fonts')]
const installed = (name) => fontDirs.some((d) => fs.existsSync(d) && fs.readdirSync(d).some((f) => f.toLowerCase().startsWith(name.toLowerCase())))
const HEAD = installed('Sora') ? 'Sora' : 'Segoe UI'
const BODY = installed('Inter') ? 'Inter' : 'Segoe UI'
const M = 0.6 // frame margin, inches

const noYear = (s) => s.replace(/,?\s*\b20\d\d\b/g, '')
const clip = (s, n) => (s.length <= n ? s : `${s.slice(0, n).replace(/[\s,;:.·-]+\S*$/, '')}…`)

// ── Images: crop each to its slot's shape once (cover), so PowerPoint never stretches them ──
fs.rmSync(assetDir, { recursive: true, force: true })
fs.mkdirSync(assetDir, { recursive: true })
const assetCache = new Map()
async function asset(src, w, h, { top = false, contain = false } = {}) {
  const key = `${src}|${w.toFixed(2)}x${h.toFixed(2)}|${top}|${contain}`
  if (assetCache.has(key)) return assetCache.get(key)
  const px = (inches) => Math.min(1800, Math.round(inches * 160))
  const png = /\.png$/i.test(src)
  const file = path.join(assetDir, `${crypto.createHash('md5').update(key).digest('hex').slice(0, 10)}.${png ? 'png' : 'jpg'}`)
  let img = sharp(path.join(root, 'public', src)).rotate()
  img = contain
    ? img.resize(px(w), px(h), { fit: 'inside' })
    : img.resize(px(w), px(h), { fit: 'cover', position: top ? 'north' : 'attention' })
  await (png ? img.png() : img.jpeg({ quality: 84, mozjpeg: true })).toFile(file)
  assetCache.set(key, file)
  return file
}

// ── Frames: each is a list of elements in frame coordinates (13.333 × 7.5 in) ──
function frame(theme) {
  const els = []
  const dark = theme === 'dark'
  const f = {
    theme, els, words: 0,
    text(key, text, o) {
      const str = Array.isArray(text) ? text.map((r) => r.text).join('') : text
      f.words += str.split(/\s+/).filter(Boolean).length
      els.push({ kind: 'text', key, text, o: { font: BODY, color: dark ? C.white : C.ink, ...o } })
    },
    rect(key, o) { els.push({ kind: 'rect', key, o }) },
    img(key, file, o) { els.push({ kind: 'img', key, file, o }) },
    eyebrow(text) { f.text('eyebrow', text.toUpperCase(), { x: M, y: 0.5, w: 9, h: 0.35, size: 11, bold: true, color: dark ? C.lime : C.limeInk, charSpacing: 1.5 }) },
    headline(plain, hl, o = {}) {
      f.text('headline', [{ text: plain, color: dark ? C.white : C.ink }, { text: hl, color: dark ? C.lime : C.limeInk }], { x: M, y: 0.85, w: SW - 2 * M, h: 1.05, size: 30, bold: true, font: HEAD, ...o })
    },
  }
  return f
}
const card = (f, key, x, y, w, h, dark = f.theme === 'dark') => f.rect(key, { x, y, w, h, fill: dark ? C.navyCard : C.tint, line: dark ? '2C2F7A' : C.line, radius: 0.18 })
const pill = (f, key, text, x, y, w, o = {}) => {
  f.rect(`${key}-bg`, { x, y, w, h: 0.3, fill: o.fill || C.lime, radius: 0.15 })
  f.text(key, text, { x, y, w, h: 0.3, size: 9, bold: true, align: 'center', valign: 'middle', color: o.color || C.ink })
}
const logo = path.join(root, 'public', 'images', 'logo-tag.png')
const logoRatio = 701 / 193
const logoPlate = (f, x, y, w) => {
  const h = w / logoRatio
  const pad = w * 0.08
  f.rect('plate', { x: x - pad, y: y - pad, w: w + 2 * pad, h: h + 2 * pad, fill: C.white, radius: 0.15 })
  f.img('logo', logo, { x, y, w, h })
}

const frames = []

// 1. Title
{
  const f = frame('dark')
  logoPlate(f, SW / 2 - 2.9, 1.0, 5.8)
  f.text('tagline', brand.tagline, { x: M, y: 3.05, w: SW - 2 * M, h: 0.9, size: 46, bold: true, font: HEAD, align: 'center' })
  f.text('lead', 'Deep concepts, disciplined systems and mentors who are there for every doubt, from the first lecture to exam day.', { x: 1.6, y: 4.05, w: SW - 3.2, h: 0.8, size: 16, color: C.soft, align: 'center' })
  f.text('exams', 'Class 11 & 12 Science  ·  JEE  ·  NEET-UG  ·  MHT-CET  ·  CUET', { x: M, y: 5.0, w: SW - 2 * M, h: 0.4, size: 14, bold: true, color: C.lime, align: 'center' })
  pill(f, 'admissions', `Admissions ${ACADEMIC_YEAR} open  ·  Kandivali West & Malad West, Mumbai`, SW / 2 - 3.4, 5.75, 6.8)
  frames.push(f)
}
// 2. About
{
  const f = frame('light')
  f.eyebrow('About futureScience')
  f.headline('A launchpad for science careers, ', 'built for the top 1%.')
  f.text('lead', `${brand.full} is ${brand.parent}, with branches in Kandivali West and Malad West, Mumbai. We teach science the way scientists think: concepts taken to the core, doubts cleared the same day, and a researched system that keeps every student moving towards a career in science and technology.`, { x: M, y: 2.15, w: 6.9, h: 2.6, size: 15, color: C.muted, lineSpacing: 1.35 })
  f.img('photo', await asset('/images/gallery/lecture.jpg', 4.9, 3.3), { x: 7.85, y: 2.15, w: 4.9, h: 3.3 })
  heroStats.forEach((s, i) => {
    const x = M + i * 3.07
    card(f, `stat${i}`, x, 5.55, 2.85, 1.35)
    f.text(`statv${i}`, `${s.prefix || ''}${s.decimals ? s.value.toFixed(s.decimals) : s.value}${s.suffix || ''}`, { x: x + 0.2, y: 5.65, w: 2.5, h: 0.6, size: 26, bold: true, font: HEAD, color: C.limeInk })
    f.text(`statl${i}`, noYear(s.label), { x: x + 0.2, y: 6.22, w: 2.5, h: 0.55, size: 10.5, color: C.muted })
  })
  frames.push(f)
}
// 3. Top results: the 2024 toppers and the best PCB and PCM scores of 2025
{
  const f = frame('dark')
  f.eyebrow('Achievers · MHT-CET')
  f.headline('Results that speak ', 'louder than claims.')
  const lead2025 = ['PCB', 'PCM'].map((s) => cet2025.students.find((t) => t.stream === s))
  const top = [...toppers, ...lead2025].sort((a, b) => b.score - a.score)
  for (const [i, t] of top.entries()) {
    const x = M + i * 3.07
    card(f, `card${i}`, x, 2.1, 2.85, 4.85)
    f.img(`photo${i}`, await asset(t.photo, 1.7, 1.7, { top: true }), { x: x + 0.575, y: 2.35, w: 1.7, h: 1.7, round: true })
    f.text(`name${i}`, t.name, { x: x + 0.15, y: 4.15, w: 2.55, h: 0.4, size: 16, bold: true, font: HEAD, align: 'center' })
    f.text(`score${i}`, [{ text: t.score.toFixed(2), color: C.lime }, { text: ' %ile', color: C.soft }], { x: x + 0.15, y: 4.55, w: 2.55, h: 0.6, size: 30, bold: true, font: HEAD, align: 'center' })
    pill(f, `stream${i}`, t.badge || `${t.stream} topper`, x + 0.35, 5.2, 2.15, { fill: t.badge ? C.gold : C.lime })
    t.breakdown.forEach(([s, v], j) => f.text(`sub${i}-${j}`, [{ text: `${s}  `, color: C.soft }, { text: v, color: C.white }], { x: x + 0.2, y: 5.62 + j * 0.38, w: 2.45, h: 0.34, size: 10.5, align: 'center' }))
  }
  frames.push(f)
}
// 4. The wider merit list
{
  const f = frame('dark')
  f.eyebrow('Achievers · MHT-CET')
  f.headline('A merit list that ', 'keeps growing.')
  const featured = new Set([...toppers.map((t) => t.name), ...['PCB', 'PCM'].map((s) => cet2025.students.find((t) => t.stream === s).name)])
  const rest = [...achievers, ...cet2025.students].filter((a) => !featured.has(a.name)).sort((a, b) => b.score - a.score).slice(0, 10)
  for (const [i, a] of rest.entries()) {
    const x = M + (i % 5) * 2.45
    const y = 2.1 + Math.floor(i / 5) * 2.45
    card(f, `card${i}`, x, y, 2.25, 2.25)
    f.img(`photo${i}`, await asset(a.photo, 1.05, 1.05, { top: true }), { x: x + 0.6, y: y + 0.17, w: 1.05, h: 1.05, round: true })
    f.text(`score${i}`, [{ text: a.score.toFixed(2), color: C.white }, { text: ' %ile', color: C.lime }], { x, y: y + 1.27, w: 2.25, h: 0.45, size: 18, bold: true, font: HEAD, align: 'center' })
    f.text(`name${i}`, `${a.name} · ${a.stream}`, { x, y: y + 1.72, w: 2.25, h: 0.35, size: 10, color: C.soft, align: 'center' })
  }
  frames.push(f)
}
// 5. Legacy
{
  const f = frame('dark')
  f.eyebrow('Then & now')
  f.headline('A legacy written in ', 'ranks, white coats and IIT IDs.')
  card(f, 'tv', M, 2.1, 6.0, 4.85)
  f.img('tvp', await asset(cet2022.photo, 1.5, 1.5, { top: true }), { x: M + 0.35, y: 2.4, w: 1.5, h: 1.5, round: true })
  f.text('tvx', noYear(cet2022.exam).toUpperCase(), { x: M + 2.1, y: 2.5, w: 3.6, h: 0.3, size: 10, bold: true, color: C.lime })
  f.text('tvn', cet2022.name, { x: M + 2.1, y: 2.8, w: 3.6, h: 0.5, size: 22, bold: true, font: HEAD })
  f.text('tvs', cet2022.score, { x: M + 2.1, y: 3.3, w: 3.6, h: 0.45, size: 18, bold: true, color: C.lime })
  cet2022.ranks.forEach(([r, where, cat], i) => {
    const x = M + 0.35 + (i % 2) * 2.75
    const y = 4.3 + Math.floor(i / 2) * 1.25
    f.rect(`tvr${i}`, { x, y, w: 2.55, h: 1.05, fill: '2A2D78', radius: 0.12 })
    f.text(`tvrn${i}`, `#${r}`, { x: x + 0.15, y: y + 0.08, w: 2.3, h: 0.45, size: 20, bold: true, font: HEAD, color: C.gold })
    f.text(`tvrw${i}`, `${where} · ${cat}`, { x: x + 0.15, y: y + 0.55, w: 2.3, h: 0.4, size: 9.5, color: C.soft })
  })
  card(f, 'ss', M + 6.2, 2.1, 5.93, 4.85)
  f.img('ssp', await asset(neetTopper.photo, 1.5, 1.5, { top: true }), { x: M + 6.55, y: 2.4, w: 1.5, h: 1.5, round: true })
  f.text('ssx', neetTopper.exam.toUpperCase(), { x: M + 8.3, y: 2.5, w: 3.6, h: 0.3, size: 10, bold: true, color: C.lime })
  f.text('ssn', neetTopper.name, { x: M + 8.3, y: 2.8, w: 3.6, h: 0.5, size: 22, bold: true, font: HEAD })
  f.text('sss', `${neetTopper.marks}/${neetTopper.outOf} · ${neetTopper.percentile} %ile`, { x: M + 8.3, y: 3.3, w: 3.6, h: 0.45, size: 18, bold: true, color: C.lime })
  neetTopper.breakdown.forEach(([s, v], i) => {
    const x = M + 6.55 + i * 1.83
    f.rect(`ssb${i}`, { x, y: 4.3, w: 1.68, h: 2.3, fill: '2A2D78', radius: 0.12 })
    f.text(`ssbv${i}`, v, { x, y: 4.65, w: 1.68, h: 0.6, size: 22, bold: true, font: HEAD, align: 'center', color: C.gold })
    f.text(`ssbs${i}`, `${s}\npercentile`, { x, y: 5.4, w: 1.68, h: 0.8, size: 11, align: 'center', color: C.soft })
  })
  frames.push(f)
}
// 6. Directors
{
  const f = frame('dark')
  f.eyebrow(mentorsIntro.eyebrow)
  f.headline('Two names behind ', 'generations of science careers.')
  for (const [i, m] of mentors.entries()) {
    const x = M + i * 6.15
    card(f, `card${i}`, x, 2.1, 5.95, 4.85)
    f.img(`photo${i}`, await asset(m.photo, 2.0, 2.65, { contain: true }), { x: x + 0.25, y: 2.35, w: 2.0, h: 2.65 })
    f.text(`role${i}`, `${m.role} · ${m.title}`.toUpperCase(), { x: x + 2.45, y: 2.45, w: 3.35, h: 0.5, size: 9.5, bold: true, color: C.gold })
    f.text(`name${i}`, m.name, { x: x + 2.45, y: 2.95, w: 3.35, h: 0.55, size: 24, bold: true, font: HEAD })
    f.text(`lead${i}`, clip(m.lead, 170), { x: x + 2.45, y: 3.55, w: 3.3, h: 1.5, size: 11.5, color: C.soft, lineSpacing: 1.25 })
    const v = m.voices[0]
    f.rect(`qbar${i}`, { x: x + 0.3, y: 5.3, w: 0.05, h: 1.35, fill: C.gold })
    f.text(`quote${i}`, `“${clip(v.quote, 150)}”`, { x: x + 0.5, y: 5.22, w: 5.25, h: 1.0, size: 11, italic: true, color: C.white })
    f.text(`by${i}`, `${v.by} · ${v.meta}`, { x: x + 0.5, y: 6.25, w: 5.25, h: 0.4, size: 9, color: C.soft })
  }
  frames.push(f)
}
// 7. Method
{
  const f = frame('light')
  f.eyebrow('The fS method')
  f.headline('Five steps from ', 'curiosity to success.')
  const colours = ['4B4E6B', 'C8247E', '17A2C4', '6FA82A', 'E9831A']
  methodology.forEach((s, i) => {
    const x = M + i * 0.42
    const y = 2.05 + i * 1.02
    f.rect(`bar${i}`, { x, y, w: 9.6, h: 0.9, fill: colours[i], radius: 0.16 })
    f.text(`n${i}`, s.n, { x: x + 0.2, y, w: 0.9, h: 0.9, size: 28, bold: true, font: HEAD, color: C.white, valign: 'middle' })
    f.text(`t${i}`, s.title.toUpperCase(), { x: x + 1.15, y: y + 0.08, w: 8.2, h: 0.35, size: 13, bold: true, font: HEAD, color: C.white })
    f.text(`d${i}`, clip(s.text, 125), { x: x + 1.15, y: y + 0.42, w: 8.3, h: 0.45, size: 9.5, color: C.white })
  })
  frames.push(f)
}
// 8. The fS Advantage
{
  const f = frame('light')
  f.eyebrow('Why parents choose futureScience')
  f.headline('The fS ', 'Advantage.')
  pillars.forEach((p, i) => {
    const x = M + (i % 3) * 4.1
    const y = 2.1 + Math.floor(i / 3) * 2.45
    card(f, `card${i}`, x, y, 3.9, 2.25)
    f.rect(`dot${i}`, { x: x + 0.3, y: y + 0.32, w: 0.4, h: 0.4, fill: C.lime, radius: 0.2 })
    f.text(`t${i}`, p.title, { x: x + 0.3, y: y + 0.85, w: 3.35, h: 0.45, size: 15, bold: true, font: HEAD })
    f.text(`d${i}`, clip(p.text, 110), { x: x + 0.3, y: y + 1.3, w: 3.35, h: 0.85, size: 10.5, color: C.muted })
  })
  frames.push(f)
}
// 9–10. Courses (four per frame)
for (const [k, [plain, hl]] of [['Courses crafted for ', 'every ambition.'], ['Specialised tracks & ', 'beyond the syllabus.']].entries()) {
  const f = frame('light')
  f.eyebrow(`Programmes ${ACADEMIC_YEAR}`)
  f.headline(plain, hl)
  for (const [i, p] of programs.slice(k * 4, k * 4 + 4).entries()) {
    const x = M + (i % 2) * 6.15
    const y = 2.1 + Math.floor(i / 2) * 2.45
    card(f, `card${i}`, x, y, 5.95, 2.25)
    f.img(`img${i}`, await asset(p.image, 1.75, 1.95), { x: x + 0.15, y: y + 0.15, w: 1.75, h: 1.95 })
    if (p.tag) pill(f, `tag${i}`, p.tag.toUpperCase(), x + 0.25, y + 0.25, 1.15, { fill: C.gold })
    f.text(`t${i}`, p.title, { x: x + 2.1, y: y + 0.18, w: 3.7, h: 0.45, size: 15, bold: true, font: HEAD })
    f.text(`s${i}`, p.sub, { x: x + 2.1, y: y + 0.62, w: 3.7, h: 0.35, size: 9.5, bold: true, color: C.limeInk })
    f.text(`d${i}`, clip(p.summary, 115), { x: x + 2.1, y: y + 1.0, w: 3.7, h: 1.1, size: 10, color: C.muted })
  }
  frames.push(f)
}
// 11. Admissions
{
  const f = frame('dark')
  f.eyebrow(`Upcoming batches · ${ACADEMIC_YEAR}`)
  f.headline('Admissions ', 'now open.')
  batches.forEach((b, i) => {
    const y = 2.1 + i * 1.6
    card(f, `card${i}`, M, y, SW - 2 * M, 1.4)
    f.rect(`date${i}`, { x: M + 0.15, y: y + 0.15, w: 2.6, h: 1.1, fill: C.lime, radius: 0.14 })
    f.text(`dl${i}`, 'COMMENCES', { x: M + 0.35, y: y + 0.25, w: 2.3, h: 0.3, size: 9, bold: true, color: C.ink })
    f.text(`dd${i}`, b.start, { x: M + 0.35, y: y + 0.55, w: 2.3, h: 0.5, size: 18, bold: true, font: HEAD, color: C.ink })
    f.text(`for${i}`, b.for, { x: M + 3.05, y: y + 0.18, w: 8.5, h: 0.3, size: 10, color: C.soft })
    f.text(`c${i}`, b.course, { x: M + 3.05, y: y + 0.45, w: 8.5, h: 0.45, size: 18, bold: true, font: HEAD })
    f.text(`d${i}`, b.details, { x: M + 3.05, y: y + 0.9, w: 8.5, h: 0.35, size: 11, color: C.soft })
  })
  frames.push(f)
}
// 12. Testimonials (they keep their years, as in the brochure)
{
  const f = frame('light')
  f.eyebrow('Student voices')
  f.headline('“Selecting fS as my mentor was ', 'the best decision.”')
  const picks = testimonials.filter((t) => t.photo).slice(0, 3)
  for (const [i, t] of picks.entries()) {
    const x = M + i * 4.1
    card(f, `card${i}`, x, 2.1, 3.9, 4.85)
    f.text(`q${i}`, '“', { x: x + 0.25, y: 2.05, w: 1, h: 0.8, size: 48, bold: true, font: HEAD, color: C.lime })
    f.text(`t${i}`, clip(t.quote, 230), { x: x + 0.3, y: 2.8, w: 3.3, h: 2.6, size: 11.5, color: C.ink, lineSpacing: 1.3 })
    f.img(`p${i}`, await asset(t.photo, 0.75, 0.75, { top: true }), { x: x + 0.3, y: 5.75, w: 0.75, h: 0.75, round: true })
    f.text(`n${i}`, t.name, { x: x + 1.2, y: 5.72, w: 2.5, h: 0.35, size: 12, bold: true, font: HEAD })
    f.text(`m${i}`, clip(t.meta, 60), { x: x + 1.2, y: 6.05, w: 2.55, h: 0.55, size: 8.5, color: C.muted })
  }
  frames.push(f)
}
// 13. Alumni
{
  const f = frame('dark')
  f.eyebrow('Where our alumni went')
  f.headline('Doctors, engineers & researchers, ', 'shaped here.')
  alumniColleges.forEach((c, i) => {
    const x = M + (i % 2) * 6.15
    const y = 2.1 + Math.floor(i / 2) * 0.97
    card(f, `card${i}`, x, y, 5.95, 0.82)
    f.rect(`dot${i}`, { x: x + 0.25, y: y + 0.29, w: 0.24, h: 0.24, fill: C.lime, radius: 0.12 })
    f.text(`n${i}`, c.name, { x: x + 0.65, y: y + 0.08, w: 5.1, h: 0.38, size: 13, bold: true, font: HEAD })
    f.text(`c${i}`, c.course, { x: x + 0.65, y: y + 0.44, w: 5.1, h: 0.3, size: 9.5, color: C.soft })
  })
  frames.push(f)
}
// 14. Life at futureScience: the latest festival album, plus a felicitation
{
  const f = frame('dark')
  f.eyebrow('Life at futureScience')
  f.headline('Where hard work ', 'meets celebration.')
  const album = celebrations[0]
  const pics = [...album.photos.filter((p) => !p.tall).slice(0, 4), gallery.find((g) => g.src.includes('felicitation'))]
  const slots = [[M, 2.1, 6.05, 4.85], [M + 6.25, 2.1, 2.93, 2.33], [M + 9.25, 2.1, 2.88, 2.33], [M + 6.25, 4.62, 2.93, 2.33], [M + 9.25, 4.62, 2.88, 2.33]]
  for (const [i, p] of pics.entries()) {
    const [x, y, w, h] = slots[i]
    f.img(`p${i}`, await asset(p.src, w, h), { x, y, w, h })
    f.rect(`cap${i}`, { x, y: y + h - 0.45, w, h: 0.45, fill: C.bg, transparency: 25 })
    f.text(`c${i}`, i === 0 ? `${album.title} · ${p.caption}` : p.caption, { x: x + 0.15, y: y + h - 0.45, w: w - 0.3, h: 0.45, size: i === 0 ? 13 : 10, bold: true, valign: 'middle' })
  }
  frames.push(f)
}
// 15. Contact
{
  const f = frame('dark')
  logoPlate(f, M + 0.05, 0.6, 3.6)
  f.text('h', [{ text: 'Book your free ', color: C.white }, { text: 'counselling session.', color: C.lime }], { x: M, y: 2.05, w: 8.4, h: 0.9, size: 32, bold: true, font: HEAD })
  f.text('seats', 'Seats in every batch are limited to protect personal attention.', { x: M, y: 2.95, w: 8.4, h: 0.45, size: 14, color: C.soft })
  const rows = [['Call / WhatsApp', contact.phone], ['Email', contact.email], ['Website', SITE_URL.replace('https://', '')], ...branches.map((b) => [`Branch · ${b.locality}`, `${b.street}, ${b.locality}, ${b.city} ${b.postalCode}`])]
  rows.forEach(([k, v], i) => {
    const y = 3.65 + i * 0.66
    f.rect(`dot${i}`, { x: M, y: y + 0.12, w: 0.3, h: 0.3, fill: C.lime, radius: 0.15 })
    f.text(`k${i}`, k.toUpperCase(), { x: M + 0.5, y, w: 7.5, h: 0.25, size: 8.5, bold: true, color: C.soft })
    f.text(`v${i}`, v, { x: M + 0.5, y: y + 0.24, w: 7.8, h: 0.38, size: 15, bold: true, font: HEAD })
  })
  const qr = path.join(assetDir, 'qr.png')
  await QRCode.toFile(qr, SITE_URL, { margin: 1, width: 700, color: { dark: '#0B0C2EFF', light: '#FFFFFFFF' } })
  f.img('qr', qr, { x: 9.4, y: 2.4, w: 3.3, h: 3.3 })
  f.text('scan', 'Scan to visit the website', { x: 9.4, y: 5.8, w: 3.3, h: 0.4, size: 12, color: C.soft, align: 'center' })
  f.text('tag', brand.tagline, { x: 9.0, y: 0.8, w: 3.75, h: 0.5, size: 16, bold: true, font: HEAD, color: C.lime, align: 'right' })
  frames.push(f)
}

// ── Canvas: frames in a snake, 5 per row, so the camera always moves to a neighbour ──
const COLS = 5
const GAP = 1.4
frames.forEach((f, i) => {
  const row = Math.floor(i / COLS)
  const col = row % 2 ? COLS - 1 - (i % COLS) : i % COLS
  f.cx = col * (SW + GAP)
  f.cy = row * (SH + GAP)
})
const rows = Math.ceil(frames.length / COLS)
const canvasW = COLS * SW + (COLS - 1) * GAP
const canvasH = rows * SH + (rows - 1) * GAP
const ovScale = Math.min((SW - 0.8) / canvasW, (SH - 0.8) / canvasH)
const cameras = {
  frame: (f) => ({ s: 1, x: f.cx, y: f.cy }),
  overview: () => ({ s: ovScale, x: canvasW / 2 - SW / 2 / ovScale, y: canvasH / 2 - SH / 2 / ovScale }),
}

// ── Slides ──
const pptx = new pptxgen()
pptx.layout = 'LAYOUT_WIDE'
pptx.title = `${brand.full}: presentation`
pptx.author = brand.legal
const timings = []

function render(cam, dur, hold) {
  const slide = pptx.addSlide()
  slide.background = { color: C.bg }
  timings.push([dur, hold])
  const s = cam.s
  for (const [fi, f] of frames.entries()) {
    const X = (x) => (f.cx + x - cam.x) * s
    const Y = (y) => (f.cy + y - cam.y) * s
    const name = (k) => `!!f${fi}-${k}`
    slide.addShape(pptx.ShapeType.roundRect, {
      objectName: name('bg'), x: X(0), y: Y(0), w: SW * s, h: SH * s, rectRadius: 0.25 * s,
      fill: { color: f.theme === 'dark' ? C.navy : C.white }, line: { color: f.theme === 'dark' ? '262978' : 'D9DEEA', width: Math.max(0.25, s) },
    })
    for (const e of f.els) {
      const o = e.o
      const geo = { objectName: name(e.key), x: X(o.x), y: Y(o.y), w: o.w * s, h: o.h * s }
      if (e.kind === 'rect') {
        slide.addShape(o.radius ? pptx.ShapeType.roundRect : pptx.ShapeType.rect, {
          ...geo, rectRadius: (o.radius || 0) * s, fill: { color: o.fill, transparency: o.transparency || 0 },
          line: o.line ? { color: o.line, width: Math.max(0.25, 0.75 * s) } : { type: 'none' },
        })
      } else if (e.kind === 'img') {
        slide.addImage({ ...geo, path: e.file, rounding: !!o.round })
      } else {
        const runs = Array.isArray(e.text) ? e.text.map((r) => ({ text: r.text, options: { color: r.color } })) : e.text
        slide.addText(runs, {
          ...geo, fontFace: o.font, fontSize: Math.max(1, o.size * s), color: o.color, bold: !!o.bold, italic: !!o.italic,
          align: o.align || 'left', valign: o.valign || 'top', margin: 0, lineSpacingMultiple: o.lineSpacing || 1.1,
          ...(o.charSpacing ? { charSpacing: o.charSpacing * s } : {}),
        })
      }
    }
  }
}
const holdFor = (f) => Math.round(Math.min(T.maxHold, Math.max(T.minHold, 2500 + f.words * T.perWord)))

render(cameras.frame(frames[0]), 1000, T.titleHold) // title
render(cameras.overview(), T.zoom, T.overviewHold) // the whole canvas
frames.slice(1, -1).forEach((f, i) => render(cameras.frame(f), i === 0 ? T.zoom : T.glide, holdFor(f)))
render(cameras.overview(), T.zoom, T.overviewHold)
render(cameras.frame(frames.at(-1)), T.zoom, T.endHold) // contact

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
const seconds = timings.reduce((n, [d, h]) => n + d + h, 0) / 1000
if (HEAD !== 'Sora' || BODY !== 'Inter') console.log('note: Sora/Inter are not installed, so the deck uses Segoe UI (install brochure/illustrator/fonts/*.ttf and run again for the brand fonts)')
console.log(`✓ ${path.relative(root, OUT)}: ${frames.length} frames, ${timings.length} slides, about ${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s as a video, ${(fs.statSync(OUT).size / 1024 / 1024).toFixed(1)} MB`)
