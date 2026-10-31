import { createContext, useContext, useEffect, useState } from 'react'

// Two editions of the site, matching the two brochures:
//   'dark'  (Classic): the original design
//   'light' (Light): white sections + livelier animations (styles in theme-light.css)
// Which one loads: the visitor's own choice from the toggle (saved in localStorage) if they
// made one, otherwise their system setting (prefers-color-scheme), followed live as it changes.
// index.html applies it to <html data-theme> before first paint, so there is no flash.
export const THEME_KEY = 'fs-theme'
const ThemeContext = createContext({ theme: 'dark', toggle: () => {} })

const apply = (theme) => {
  const root = document.documentElement
  if (theme === 'light') root.dataset.theme = 'light'
  else delete root.dataset.theme
}
const saved = () => { try { return localStorage.getItem(THEME_KEY) } catch { return null } }

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark') // matches the pre-rendered HTML; corrected on mount
  useEffect(() => {
    if (document.documentElement.dataset.theme === 'light') setTheme('light')
    // no explicit choice yet: keep following the system setting
    const mq = window.matchMedia?.('(prefers-color-scheme: light)')
    if (!mq) return
    const onChange = (e) => {
      if (saved()) return
      const next = e.matches ? 'light' : 'dark'
      apply(next)
      setTheme(next)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    apply(next)
    setTheme(next)
    try { localStorage.setItem(THEME_KEY, next) } catch {}
  }
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
