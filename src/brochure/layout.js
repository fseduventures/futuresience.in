// Shared by Brochure.jsx (rendering) and scripts/make-brochure.mjs (PDF / .ai export).
export const PAGE_COUNT = 12 // must be a multiple of 4 and match ORDER in Brochure.jsx

// Saddle-stitch imposition. Each entry is one A3 landscape side: [left page, right page];
// sides alternate front/back per sheet.
export function imposition(total = PAGE_COUNT) {
  const sides = []
  for (let i = 0; i < total / 4; i++) {
    sides.push([total - 2 * i, 1 + 2 * i])
    sides.push([2 + 2 * i, total - 1 - 2 * i])
  }
  return sides
}

export const sideName = (i, [l, r]) =>
  `Sheet${Math.floor(i / 2) + 1}-${i % 2 ? 'Back' : 'Front'}_p${String(l).padStart(2, '0')}-p${String(r).padStart(2, '0')}`
