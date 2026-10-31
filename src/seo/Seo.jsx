import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { pages, canonical } from './meta.js'

// Keeps <title>, description and canonical in sync during client-side navigation.
// The initial HTML for every page already has these (plus JSON-LD) from scripts/prerender.mjs.
export default function Seo() {
  const { pathname } = useLocation()
  useEffect(() => {
    const path = pathname.replace(/\/+$/, '') || '/'
    const page = pages[path]
    if (!page) { document.title = 'Page not found | futureScience'; return }
    document.title = page.title
    const set = (sel, attr, value) => { const el = document.head.querySelector(sel); if (el) el.setAttribute(attr, value) }
    set('meta[name="description"]', 'content', page.description)
    set('link[rel="canonical"]', 'href', canonical(path))
    set('meta[property="og:title"]', 'content', page.title)
    set('meta[property="og:description"]', 'content', page.description)
    set('meta[property="og:url"]', 'content', canonical(path))
  }, [pathname])
  return null
}
