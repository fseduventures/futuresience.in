import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Separate build for the print brochure (not part of the website's dist/)
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'brochure-dist',
    emptyOutDir: true,
    rollupOptions: { input: 'brochure.html' },
  },
  preview: { port: 4180, strictPort: true },
})
