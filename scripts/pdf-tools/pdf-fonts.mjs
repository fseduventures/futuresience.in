// Lists the fonts embedded in a PDF, including those inside compressed object streams.
// Usage: node scripts/pdf-tools/pdf-fonts.mjs file.pdf
import fs from 'node:fs'
import zlib from 'node:zlib'
const buf = fs.readFileSync(process.argv[2])
const s = buf.toString('latin1')
const texts = [s]
const re = /<<([^]*?)>>\s*stream\r?\n/g
let m
while ((m = re.exec(s))) {
  if (!/FlateDecode/.test(m[1])) continue
  const start = m.index + m[0].length
  const end = s.indexOf('endstream', start)
  try { texts.push(zlib.inflateSync(buf.subarray(start, end)).toString('latin1')) } catch {}
}
const fonts = new Set()
for (const t of texts) for (const f of t.matchAll(/\/BaseFont\s*\/([^\s/\]>]+)/g)) fonts.add(f[1].replace(/^[A-Z]{6}\+/, ''))
console.log([...fonts].sort().join('\n'))
