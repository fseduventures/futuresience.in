// Runs after prerender. Recompresses the copies in dist/images (same names, so no markup
// changes). public/images keeps the originals because the print brochure reads them.
// Also writes a 720px "-sm" copy of every wide JPEG, for phones (hero background, gallery srcset).
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const dir = path.resolve(import.meta.dirname, '..', 'dist', 'images')
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]))

const SMALL = 720

const jpeg = (img) => img.jpeg({ quality: 78, mozjpeg: true, progressive: true }).toBuffer()

let before = 0
let after = 0
let small = 0
for (const file of walk(dir).filter((f) => /\.(jpe?g|png)$/i.test(f))) {
  const input = fs.readFileSync(file)
  // Don't downsize the logos: resampling adds colours, and the palette PNG came out bigger
  const img = sharp(input).rotate()
  // Palette PNG keeps transparency (logos, mentor cut-outs) at a fraction of the size
  const output = /\.png$/i.test(file)
    ? await img.png({ palette: true, quality: 90, effort: 10, compressionLevel: 9 }).toBuffer()
    : await jpeg(img)
  before += input.length
  // Already-small files can grow when re-encoded, so only keep real savings
  if (output.length < input.length) fs.writeFileSync(file, output)
  after += Math.min(output.length, input.length)

  if (/\.jpe?g$/i.test(file) && (await sharp(input).metadata()).width > SMALL * 1.25) {
    fs.writeFileSync(file.replace(/(\.jpe?g)$/i, '-sm$1'), await jpeg(sharp(input).rotate().resize({ width: SMALL })))
    small++
  }
}

const mb = (n) => (n / 1024 / 1024).toFixed(2)
console.log(`✓ images: ${mb(before)} MB → ${mb(after)} MB, ${small} phone-size copies`)
