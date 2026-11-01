import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import pkg from './package.json' with { type: 'json' }

// The "-sm" phone images only exist in dist/ (made by scripts/optimize-images.mjs).
// In dev, serve the original instead so phone widths don't show a missing background.
const smallImagesInDev = {
  name: 'small-images-in-dev',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const m = req.url?.match(/^(\/images\/.+)-sm(\.jpe?g)$/i)
      if (m && !fs.existsSync(`public${req.url}`)) req.url = m[1] + m[2]
      next()
    })
  },
}

export default defineConfig({
  plugins: [react(), smallImagesInDev],
  // package.json is the single source of the release version (bumped by release.py)
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  server: { port: 5173, open: true },
})
