// Last build step: packs the contents of dist/ (including .htaccess) into dist-build.zip at the
// project root, ready to upload to public_html and extract. Files sit at the zip's root, not in a
// dist/ folder. Plain zip written with node:zlib, so there's nothing to install.
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const out = path.join(root, 'dist-build.zip')

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]))

// MS-DOS date/time, which zip headers use
const now = new Date()
const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)
const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()

const locals = []
const centrals = []
let offset = 0
for (const file of walk(dist)) {
  const name = Buffer.from(path.relative(dist, file).split(path.sep).join('/'))
  const data = fs.readFileSync(file)
  const deflated = zlib.deflateRawSync(data, { level: 9 })
  // already-compressed files (jpg, png, woff2, pdf) can grow when deflated; store those as-is
  const stored = deflated.length >= data.length
  const body = stored ? data : deflated
  const crc = zlib.crc32(data)

  const local = Buffer.alloc(30)
  local.writeUInt32LE(0x04034b50, 0)
  local.writeUInt16LE(20, 4) // version needed
  local.writeUInt16LE(0x0800, 6) // UTF-8 names
  local.writeUInt16LE(stored ? 0 : 8, 8)
  local.writeUInt16LE(dosTime, 10)
  local.writeUInt16LE(dosDate, 12)
  local.writeUInt32LE(crc, 14)
  local.writeUInt32LE(body.length, 18)
  local.writeUInt32LE(data.length, 22)
  local.writeUInt16LE(name.length, 26)
  locals.push(local, name, body)

  const central = Buffer.alloc(46)
  central.writeUInt32LE(0x02014b50, 0)
  central.writeUInt16LE(20, 4) // version made by
  central.writeUInt16LE(20, 6)
  central.writeUInt16LE(0x0800, 8)
  central.writeUInt16LE(stored ? 0 : 8, 10)
  central.writeUInt16LE(dosTime, 12)
  central.writeUInt16LE(dosDate, 14)
  central.writeUInt32LE(crc, 16)
  central.writeUInt32LE(body.length, 20)
  central.writeUInt32LE(data.length, 24)
  central.writeUInt16LE(name.length, 28)
  central.writeUInt32LE(offset, 42)
  centrals.push(central, name)

  offset += local.length + name.length + body.length
}

const centralSize = centrals.reduce((n, b) => n + b.length, 0)
const end = Buffer.alloc(22)
end.writeUInt32LE(0x06054b50, 0)
end.writeUInt16LE(centrals.length / 2, 8)
end.writeUInt16LE(centrals.length / 2, 10)
end.writeUInt32LE(centralSize, 12)
end.writeUInt32LE(offset, 16)

fs.writeFileSync(out, Buffer.concat([...locals, ...centrals, end]))
console.log(`✓ dist-build.zip: ${centrals.length / 2} files, ${(fs.statSync(out).size / 1024 / 1024).toFixed(1)} MB (upload to public_html and extract)`)
