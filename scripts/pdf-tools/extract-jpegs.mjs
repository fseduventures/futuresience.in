// Dumps every embedded JPEG (DCTDecode stream) from a PDF. Usage: node extract-jpegs.mjs in.pdf outDir
import fs from 'node:fs'
import path from 'node:path'
const [, , input, outDir] = process.argv
const buf = fs.readFileSync(input)
const s = buf.toString('latin1')
fs.mkdirSync(outDir, { recursive: true })
const re = /(\d+) 0 obj\s*<<([\s\S]*?)>>\s*stream\r?\n/g
let m, n = 0
while ((m = re.exec(s))) {
  const dict = m[2]
  if (!/\/DCTDecode/.test(dict) || !/\/Subtype\s*\/Image/.test(dict)) continue
  const start = m.index + m[0].length
  const lenM = dict.match(/\/Length\s+(\d+)(\s+0\s+R)?/)
  let end
  if (lenM && !lenM[2]) end = start + Number(lenM[1])
  else end = s.indexOf('endstream', start)
  const w = dict.match(/\/Width\s+(\d+)/)?.[1], h = dict.match(/\/Height\s+(\d+)/)?.[1]
  const cs = dict.match(/\/ColorSpace\s*\/(\w+)/)?.[1] || 'ref'
  const file = path.join(outDir, `obj${m[1]}_${w}x${h}_${cs}.jpg`)
  fs.writeFileSync(file, buf.subarray(start, end))
  n++
}
console.log(`extracted ${n} jpeg(s)`)
