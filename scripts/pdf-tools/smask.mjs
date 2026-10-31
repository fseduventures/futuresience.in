// For given image object ids, finds the /SMask object, inflates it, and writes it as an 8-bit grayscale BMP.
// Usage: node smask.mjs in.pdf outDir 628 630 ...
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
const [, , input, outDir, ...ids] = process.argv
const buf = fs.readFileSync(input)
const s = buf.toString('latin1')

function obj(id) {
  const m = new RegExp(`(?:^|[\\r\\n\\s])${id} 0 obj\\s*<<([\\s\\S]*?)>>\\s*stream\\r?\\n`).exec(s)
  if (!m) return null
  const start = m.index + m[0].length
  const lenM = m[1].match(/\/Length\s+(\d+)(\s+0\s+R)?/)
  const end = lenM && !lenM[2] ? start + Number(lenM[1]) : s.indexOf('endstream', start)
  return { dict: m[1], data: buf.subarray(start, end) }
}

function bmp(w, h, gray) {
  const row = Math.ceil(w / 4) * 4
  const size = 54 + 1024 + row * h
  const b = Buffer.alloc(size)
  b.write('BM', 0); b.writeUInt32LE(size, 2); b.writeUInt32LE(54 + 1024, 10)
  b.writeUInt32LE(40, 14); b.writeInt32LE(w, 18); b.writeInt32LE(-h, 22); b.writeUInt16LE(1, 26); b.writeUInt16LE(8, 28)
  b.writeUInt32LE(row * h, 34); b.writeUInt32LE(256, 46)
  for (let i = 0; i < 256; i++) { b[54 + i * 4] = i; b[55 + i * 4] = i; b[56 + i * 4] = i }
  for (let y = 0; y < h; y++) gray.copy(b, 54 + 1024 + y * row, y * w, y * w + w)
  return b
}

for (const id of ids) {
  const img = obj(id)
  const ref = img?.dict.match(/\/SMask\s+(\d+)\s+0\s+R/)
  console.log(id, img ? img.dict.replace(/\s+/g, ' ').slice(0, 200) : 'not found')
  if (!ref) continue
  const m = obj(ref[1])
  const w = +m.dict.match(/\/Width\s+(\d+)/)[1], h = +m.dict.match(/\/Height\s+(\d+)/)[1]
  const bpc = +(m.dict.match(/\/BitsPerComponent\s+(\d+)/)?.[1] || 8)
  const raw = /FlateDecode/.test(m.dict) ? zlib.inflateSync(m.data) : m.data
  console.log(`  smask ${ref[1]}: ${w}x${h} bpc=${bpc} bytes=${raw.length}`)
  fs.writeFileSync(path.join(outDir, `mask${id}.bmp`), bmp(w, h, raw))
}
