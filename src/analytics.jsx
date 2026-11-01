import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from './theme.jsx'

// The tracker scripts are added by scripts/prerender.mjs only when IDs are set in site.js,
// so every call here is a no-op in dev or when tracking is off.
export default function Analytics() {
  const { pathname } = useLocation()
  const first = useRef(true)
  const { theme } = useTheme()
  const sentTheme = useRef(null)

  // The head script tags events with the landing theme; keep site_theme current when it changes.
  // Read <html data-theme> rather than `theme`, which starts as 'dark' until ThemeProvider mounts.
  useEffect(() => {
    const current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
    if (sentTheme.current === null) { sentTheme.current = current; return }
    if (current === sentTheme.current) return
    sentTheme.current = current
    window.gtag?.('set', { site_theme: current })
    window.gtag?.('event', 'theme_change', { site_theme: current })
  }, [theme])

  // The Pixel base code counts the landing page; count later in-app navigations here
  useEffect(() => {
    if (first.current) { first.current = false; return }
    window.fbq?.('track', 'PageView')
  }, [pathname])

  // Phone, WhatsApp and email taps are this site's enquiries, so report them as leads;
  // brochure PDFs get their own event so downloads can be counted per button and edition
  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest?.('a[href]')
      const href = link?.getAttribute('href') || ''
      if (/\.pdf$/i.test(href)) {
        const params = {
          file_name: href.split('/').pop(),
          edition: /-Light\.pdf$/i.test(href) ? 'light' : 'dark',
          button_location: link.closest('header') ? 'header' : link.closest('footer') ? 'footer' : 'page',
        }
        window.gtag?.('event', 'brochure_download', params)
        window.fbq?.('trackCustom', 'BrochureDownload', params)
        return
      }
      const method = href.startsWith('tel:') ? 'phone' : /wa\.me|whatsapp/.test(href) ? 'whatsapp' : href.startsWith('mailto:') ? 'email' : ''
      if (!method) return
      window.gtag?.('event', 'generate_lead', { method })
      window.fbq?.('track', 'Contact', { method })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
